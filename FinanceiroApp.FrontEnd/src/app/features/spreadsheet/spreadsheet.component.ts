import { DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrl: './spreadsheet.component.scss'
})
export class SpreadsheetComponent implements OnInit {
ngOnInit(): void {
  const container = $(".container");
  container.css({
    "display": "flex",
    "flex-direction": "column",
    "overflow": "auto",
    'width': '100%',
    "background-color": "#f1f1f1",
  });

  const NUM_ROWS = 100;
  const NUM_COLUMNS = 100;
  const CELL_HEIGHT = 25;
  const CELL_WIDTH = 100;
  
  const spreadsheet = $("<div></div>").css({
    "display": "flex",
    "flex-direction": "column",
    "font-family": "Arial, sans-serif",
    "width": `${NUM_COLUMNS * CELL_WIDTH}px`,
    "height": '80vh',
    "max-width": "100000px"
  });
  
  // Criar cabeçalho
  const header = $("<div></div>").css({
    "display": "flex",
    "position": "sticky",
    "top": "0",
    "z-index": "1",
    "background-color": "#f1f1f1",
  });
  header.append($("<div></div>").css("width", CELL_WIDTH + "px"));
  for (let i = 0; i < NUM_COLUMNS; i++) {
    const columnLabel = i < 26 ? String.fromCharCode(65 + i) : String.fromCharCode(64 + Math.floor(i / 26)) + String.fromCharCode(65 + (i % 26));
    header.append($("<div></div>").text(columnLabel).css({
      "width": CELL_WIDTH + "px",
      "text-align": "center",
      "border": "1px solid #ddd",
      "box-sizing": "border-box",
      "font-weight": "bold",
    }));
  }
  spreadsheet.append(header);
  
  // Criar corpo da planilha
  for (let i = 1; i <= NUM_ROWS; i++) {
    const row = $("<div></div>").css({
      "display": "flex",
    });
    row.append($("<div></div>").text(i).css({
      "width": CELL_WIDTH + "px",
      "text-align": "center",
      "border": "1px solid #ddd",
      "box-sizing": "border-box",
      "font-weight": "bold",
    }));
    for (let j = 0; j < NUM_COLUMNS; j++) {
      const cell = $("<div></div>").css({
        "width": CELL_WIDTH + "px",
        "height": CELL_HEIGHT + "px",
        "border": "1px solid #ddd",
        "text-align": "left",
        "padding": "5px",
        "box-sizing": "border-box",
      });
      cell.attr("contenteditable", "true");
      row.append(cell);
    }
    spreadsheet.append(row);
  }
  
  container.append(spreadsheet);
  
  // Adicionar funcionalidade de edição
  $("div[contenteditable]").on("focus", function() {
    //@ts-ignore
    $(this).css("background-color", "#e6f3ff");
  }).on("blur", function() {
    //@ts-ignore
    $(this).css("background-color", "");
  });
  
  // Adicionar funcionalidade de seleção de células
  let isSelecting = false;
  let startCell: $.JQuery<HTMLElement> | null = null;
  
  $("div[contenteditable]").on("mousedown", function(e) {
    isSelecting = true;
    //@ts-ignore
    startCell = $(this);
    $("div[contenteditable]").removeClass("selected");
    //@ts-ignore
    $(this).addClass("selected");
    e.preventDefault();
  });
  
  $(document).on("mousemove", function(e) {
    if (isSelecting && startCell) {
      const currentCell = $(e.target).closest("div[contenteditable]");
      if (currentCell.length) {
        $("div[contenteditable]").removeClass("selected");
        selectCellsBetween(startCell, currentCell);
      }
    }
  });
  
  $(document).on("mouseup", function() {
    isSelecting = false;
  });
  
  function selectCellsBetween(start: $.JQuery<HTMLElement>, end: $.JQuery<HTMLElement>) {
    const startRow = start.parent().index();
    const startCol = start.index() - 1;
    const endRow = end.parent().index();
    const endCol = end.index() - 1;
    
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);
    
    for (let i = minRow; i <= maxRow; i++) {
      for (let j = minCol; j <= maxCol; j++) {
        spreadsheet.children().eq(i).children().eq(j + 1).addClass("selected");
      }
    }
  }
}
}