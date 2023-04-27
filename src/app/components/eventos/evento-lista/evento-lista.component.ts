import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Evento } from "../../../models/Evento";
import { EventoService } from "../../../services/evento.service";

@Component({
  selector: "app-evento-lista",
  templateUrl: "./evento-lista.component.html",
  styleUrls: ["./evento-lista.component.scss"],
})
export class EventoListaComponent implements OnInit {
  modalRef: BsModalRef | undefined;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public larguraImagem = 120;
  public margemImagem = 2;
  public exibirImagem = false;
  private _filtroLista = "";
  public eventoId = 0;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toustr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();

    return this.eventos.filter(
      (evento: { tema: string; local: string }) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  public getEventos(): void {
    const observer = {
      next: (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toustr.error(
          "Erro ao carregar os eventos!",
          "Erro!"
        );
      },
      complete: () => {
        this.spinner.hide();
      },
    };
    this.eventoService.getEventos().subscribe(observer);
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        console.log('#####RES')
        this.toustr.success('Evento deletado', 'Deletado');
        this.spinner.hide();
        this.getEventos();
      },
      (error: any) => {
        console.error(error);
        this.spinner.hide();
        this.toustr.error('Erro ao tentar deletar o evento', 'Erro');
      },
      () => {
        this.spinner.hide();
      }
    )
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
