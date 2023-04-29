import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { CssValidatorService } from "../../../helpers/css-validator.service";
import { Evento } from "../../../models/Evento";
import { EventoService } from "../../../services/evento.service";

@Component({
  selector: "app-evento-detalhe",
  templateUrl: "./evento-detalhe.component.html",
  styleUrls: ["./evento-detalhe.component.scss"],
})
export class EventoDetalheComponent implements OnInit {
  form!: FormGroup;
  evento: Evento;
  estadoSalvar = 'post';

  constructor(
    private fb: FormBuilder,
    public cv: CssValidatorService,
    private localeService: BsLocaleService,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toustr: ToastrService,
    private eventoService: EventoService) {
    this.localeService.use('pt-br')
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      showWeekNumbers: false,
    }
  }

  public carregarEvento(): void {
    this.spinner.show();
    const eventoIdParam = this.router.snapshot.paramMap.get('id');
    if (eventoIdParam !== null) {
      this.estadoSalvar = 'put';
      this.eventoService.getEventoById(Number(eventoIdParam)).subscribe(
        (evento: Evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento)
        },
        (error: any) => {
          this.spinner.hide();
          this.toustr.error('Erro ao tentar carregar evento', 'Erro')
          console.error(error)
        },
        () => {
          this.spinner.hide();
        },
      )
    }
    this.spinner.hide();
  }

  public salvarAlteracao(): void {
    this.spinner.show()
    if (this.form.valid) {
      this.evento = (this.estadoSalvar === 'post')
        ? { ...this.form.value }
        : { id: this?.evento?.id, ...this.form.value };

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        () => this.toustr.success('Evento salvo', 'Sucesso'),
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
  });
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
