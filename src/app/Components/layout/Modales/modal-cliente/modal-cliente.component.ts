import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Cliente } from 'src/app/Interfaces/cliente';
import { ClienteService } from 'src/app/Services/cliente.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.css'],
})
export class ModalClienteComponent implements OnInit {
  formularioCliente: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  // listaCategorias: Categoria[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCliente: Cliente,
    private fb: FormBuilder,
    private _clienteServicio: ClienteService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioCliente = this.fb.group({
      nombre: ['', Validators.required],
      edad: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });

    if (this.datosCliente != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
  }

  ngOnInit(): void {
    if (this.datosCliente != null) {
      this.formularioCliente.patchValue({
        nombre: this.datosCliente.nombre,
        edad: this.datosCliente.edad,
        telefono: this.datosCliente.telefono,
        correo: this.datosCliente.correo,
        esActivo: this.datosCliente.esActivo.toString(),
      });
    }
  }

  guardarEditar_Cliente() {
    const _cliente: Cliente = {
      idCliente: this.datosCliente == null ? 0 : this.datosCliente.idCliente,
      nombre: this.formularioCliente.value.nombre,
      edad: this.formularioCliente.value.edad,
      telefono: this.formularioCliente.value.telefono,
      correo: this.formularioCliente.value.correo,
      esActivo: parseInt(this.formularioCliente.value.esActivo),
    };

    if (this.datosCliente == null) {
      this._clienteServicio.guardar(_cliente).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta(
              'El cliente fue registrado',
              'Exito'
            );
            this.modalActual.close('true');
          } else
            this._utilidadServicio.mostrarAlerta(
              'No se pudo registrar el cliente',
              'Error'
            );
        },
        error: (e) => {},
      });
    } else {
      this._clienteServicio.editar(_cliente).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta(
              'El cliente fue editado',
              'Exito'
            );
            this.modalActual.close('true');
          } else
            this._utilidadServicio.mostrarAlerta(
              'No se pudo editar el cliente',
              'Error'
            );
        },
        error: (e) => {},
      });
    }
  }
}
