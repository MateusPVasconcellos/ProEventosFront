import { TemplateRef } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { CssValidatorService } from "../../../helpers/css-validator.service";
import { Evento } from "../../../models/Evento";
import { Lote } from "../../../models/Lote";
import { EventoService } from "../../../services/evento.service";
import { LoteService } from "../../../services/lote.service";

@Component({
  selector: "app-evento-detalhe",
  templateUrl: "./evento-detalhe.component.html",
  styleUrls: ["./evento-detalhe.component.scss"],
})
export class EventoDetalheComponent implements OnInit {
  form!: FormGroup;
  evento: Evento;
  estadoSalvar = 'post';
  eventoId: number;
  loteAtual = {id: 0, nome: '', indice: 0};
  modalRef: BsModalRef;

  constructor(
    private fb: FormBuilder,
    public cv: CssValidatorService,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toustr: ToastrService,
    private modalService: BsModalService,
    private loteService: LoteService,
    private eventoService: EventoService) {
    this.localeService.use('pt-br')
  }

  get f(): any {
    return this.form.controls;
  }

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      withTimepicker: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      showWeekNumbers: false,
    }
  }

  get bsConfigLote(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
    }
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  public carregarEvento(): void {
    this.spinner.show();
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id') === 0 ? null : +this.activatedRouter.snapshot.paramMap.get('id');
    if (this.eventoId !== null) {
      this.estadoSalvar = 'put';
      this.eventoService.getEventoById(Number(this.eventoId)).subscribe(
        (evento: Evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
          this.evento.lote.forEach(lote => {
            this.lotes.push(this.criarLote(lote))
          })
        },
        (error: any) => {
          this.toustr.error('Erro ao tentar carregar evento', 'Erro')
          console.error(error)
        },
      ).add(() => this.spinner.hide())
    }
    this.spinner.hide()
  }

  public salvarAlteracao(): void {
    this.spinner.show()
    if (this.form.valid) {
      this.evento = (this.estadoSalvar === 'post')
        ? { ...this.form.value }
        : { id: this?.evento?.id, ...this.form.value };

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        (retorno: Evento) => {
          this.toustr.success('Evento salvo', 'Sucesso');
          this.router.navigate([`eventos/detalhe/${retorno.id}`]);
        },
        (error) => {
          console.error(error);
          this.spinner.hide();
          this.toustr.error('Erro ao salvar evento', 'Erro');
        },
        () => {
          this.spinner.hide();
        },
      );
    }
  }

  public salvarLotes(): void {
    this.spinner.show();
    if (this.form.controls.lotes.valid) {
      this.loteService.saveLote(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toustr.success('Sucesso ao salvar lote', 'Sucesso')
            this.lotes.reset();
          },
          (error) => {
            console.error(error);
            this.toustr.error('Erro ao salvar lote', 'Erro');
          }
        ).add(() => this.spinner.hide());
    }
  }

  private validation(): void {
    this.form = this.fb.group({
      local: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      dataEvento: ["", Validators.required],
      tema: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      qtdPessoas: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.max(1200),
        ],
      ],
      imagemUrl: ["", Validators.required],
      telefone: ["", Validators.required],
      email: ["", [Validators.email, Validators.required]],
      lotes: this.fb.array([]),
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
      quantidade: [lote.quantidade, Validators.required],
    })
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {
    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;

    if (!this.loteAtual.id) {
      return this.lotes.removeAt(this.loteAtual.indice);
    }

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.loteAtual.id, this.eventoId).subscribe(
      () => {
        this.toustr.success('Lote Deletado', 'Sucesso');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error: any) => {
        this.toustr.error('Erro ao deletar lote', 'Erro');
      }
    ).add(() => this.spinner.hide());
  }

  public declineDeleteLote(): void {
    this.modalRef.hide();
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  public onSubmit(): void {
    return;
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }
}
