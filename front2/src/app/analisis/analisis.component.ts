import { Component, OnInit } from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductoService } from '../../services/producto.service';
import FileSaver from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as ExcelJS from 'exceljs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-analisis',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.css']
})
export class AnalisisComponent implements OnInit {
  
  filters = {
    producto: ''
  };

  productos: Product[] = [];
  lisProducto: Product[] = [];
  filteredVentaConDetalle: Product[] = [];

  constructor(private _productoServices: ProductoService) {}

  ngOnInit(): void {
    this.getlistPro();
  }

  getlistPro(): void {
    this._productoServices.getProducts().subscribe((data: Product[]) => {
      this.productos = data;
      this.lisProducto = data;
    });
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reportes de Venta');

    worksheet.columns = [
      { header: 'Producto', key: 'producto', width: 30 },
      { header: 'Stock', key: 'stock', width: 15 },
      { header: 'Precio Compra', key: 'precioCompra', width: 15 },
      { header: 'Precio Venta', key: 'precioVenta', width: 15 },
      { header: 'Ganancia', key: 'ganancia', width: 15 }
    ];

    this.filteredVentaConDetalle.forEach(item => {
      worksheet.addRow({
        producto: item.categoria,
        stock: item.stock,
        precioCompra: item.precio_compra,
        precioVenta: item.precio_venta,
        ganancia: item.precio_venta - item.precio_compra
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      this.saveAsExcelFile(buffer, 'Reportes');
    });
  }

  exportToPDF(): void {
    const data = document.getElementById('pdfTable')!;
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const doc = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('Reportes.pdf');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  applyFilters(): void {
    this.filteredVentaConDetalle = this.lisProducto.filter(item => {
      return !this.filters.producto || item.categoria === this.filters.producto;
    });
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
