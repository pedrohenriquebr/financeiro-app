import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-help-dialog',
  template: `
    <h2 mat-dialog-title>Como criar padrões de mapeamento</h2>
    <mat-dialog-content>
      <p>
        Você pode usar padrões de texto para mapear automaticamente suas transações para categorias específicas.
        Aqui estão algumas maneiras de criar esses padrões:
      </p>

      <h3>1. Texto Exato</h3>
      <p>
        Para corresponder a uma descrição exata, simplesmente digite o texto como ele aparece:
        <br>
        <code>TEF CREDITO SALARIO</code>
        <br>
        Isso vai corresponder exatamente a "TEF CREDITO SALARIO"
      </p>

      <h3>2. Ignorar Maiúsculas/Minúsculas</h3>
      <p>
        Para corresponder independente de maiúsculas ou minúsculas, adicione (?i) no início:
        <br>
        <code>(?i)netflix</code>
        <br>
        Isso vai corresponder a "Netflix", "NETFLIX", "netflix", etc.
      </p>

      <h3>3. Parte do Texto</h3>
      <p>
        Para corresponder a qualquer texto que contenha uma palavra específica:
        <br>
        <code>.*IFOOD.*</code>
        <br>
        Isso vai corresponder a qualquer descrição que contenha "IFOOD"
      </p>

      <h3>4. Início do Texto</h3>
      <p>
        Para corresponder a texto que comece com uma palavra específica:
        <br>
        <code>UBER.*</code>
        <br>
        Isso vai corresponder a qualquer descrição que comece com "UBER"
      </p>

      <h3>Exemplos Práticos</h3>
      <ul>
        <li><code>NETFLIX</code> - Exatamente "NETFLIX"</li>
        <li><code>(?i)uber</code> - "UBER", "Uber", "uber", etc.</li>
        <li><code>.*IFOOD.*</code> - Qualquer descrição contendo "IFOOD"</li>
        <li><code>PAG\*.*</code> - Descrições começando com "PAG*"</li>
      </ul>

      <p class="tip">
        <mat-icon>lightbulb</mat-icon>
        <strong>Dica:</strong> Comece com padrões simples e específicos. Use o texto exato da descrição
        quando possível. Isso ajuda a evitar mapeamentos incorretos.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      max-height: 80vh;
      padding: 20px;
    }
    h3 {
      margin-top: 20px;
      color: #1976d2;
    }
    code {
      background-color: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    .tip {
      background-color: #e3f2fd;
      padding: 10px;
      border-radius: 4px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    ul {
      list-style-type: none;
      padding-left: 0;
    }
    li {
      margin-bottom: 8px;
    }
  `]
})
export class HelpDialogComponent {
  constructor(public dialogRef: MatDialogRef<HelpDialogComponent>) {}
}
