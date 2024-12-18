#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::process::{Command, Child, Stdio};
use std::sync::Mutex;
use std::os::windows::process::CommandExt;
use tauri::{
  CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem
};

// Struct para gerenciar o processo da API
struct ApiProcess(Mutex<Child>);


fn main() {
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let hide = CustomMenuItem::new("hide".to_string(), "Hide Window");
  let show = CustomMenuItem::new("show".to_string(), "Show Window");
  let tray_menu = SystemTrayMenu::new()
    .add_item(show)
    .add_item(hide)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(quit);
  let system_tray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::LeftClick {
        position: _,
        size: _,
        ..
      } => {
        let window = app.get_window("main").unwrap();
        window.show().unwrap();
      }
      SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
        "quit" => {
          // Mata o processo da API antes de sair
          if let Some(state) = app.try_state::<ApiProcess>() {
            let mut child = state.0.lock().expect("failed to lock API process mutex");
            child.kill().expect("failed to kill API process");
          }
          std::process::exit(0);
        }
        "hide" => {
          let window = app.get_window("main").unwrap();
          window.hide().unwrap();
        }
        "show" => {
          let window = app.get_window("main").unwrap();
          window.show().unwrap();
        }
        _ => {}
      },
      _ => {}
    })
    .setup(|app| {
      // Inicia a API .NET como um processo em background
      let api_path = app
        .path_resolver()
        .resolve_resource("../Financeiro.API/bin/Release/net8.0/publish/Financeiro.API.exe")
        .expect("failed to resolve api path");

      println!("Starting API from: {}", api_path.display());

      let mut command = Command::new(api_path);
      if cfg!(debug_assertions) {
        command.env("ASPNETCORE_ENVIRONMENT", "Development");
      } else {
        command.env("ASPNETCORE_ENVIRONMENT", "Production");
      }
      command.env("ASPNETCORE_URLS", "http://localhost:5005");

      let child = command
        .stdout(Stdio::null()) // Optional: suppress stdout
        .stderr(Stdio::null()) // Optional: suppress stderr
        .creation_flags(0x08000000) // CREATE_NO_WINDOW
        .spawn()
        .expect("failed to start API");

      // Guarda o processo da API em um estado gerenciado
      app.manage(ApiProcess(Mutex::new(child)));

      Ok(())
    })
    .on_window_event(|event| {
      if let tauri::WindowEvent::Destroyed = event.event() {
        // Obtém o processo da API e o mata antes de fechar a aplicação
        if let Some(state) = event.window().try_state::<ApiProcess>() {
          let mut child = state.0.lock().expect("failed to lock API process mutex");
          child.kill().expect("failed to kill API process");
        }
        std::process::exit(0);
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
