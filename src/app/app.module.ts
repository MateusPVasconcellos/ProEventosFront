import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DateTimeFormatPipe } from "./helpers/DateTimeFormat.pipe";
import { DateFormatPipe } from "./helpers/DateFormat.pipe";
import { EventoService } from "./services/evento.service";
import { LoteService } from "./services/lote.service";
import { CssValidatorService } from "@app/helpers/css-validator.service";

import { ModalModule } from "ngx-bootstrap/modal";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from "ngx-toastr";
import { NgxSpinnerModule } from 'ngx-spinner';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { NgxCurrencyModule } from 'ngx-currency';


import { ContatosComponent } from "./components/contatos/contatos.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { EventoDetalheComponent } from "./components/eventos/evento-detalhe/evento-detalhe.component";
import { EventoListaComponent } from "./components/eventos/evento-lista/evento-lista.component";
import { EventosComponent } from "./components/eventos/eventos.component";
import { PalestrantesComponent } from "./components/palestrantes/palestrantes.component";
import { LoginComponent } from "./components/user/login/login.component";
import { PerfilComponent } from "./components/user/perfil/perfil.component";
import { RegistrationComponent } from "./components/user/registration/registration.component";
import { UserComponent } from "./components/user/user.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { TituloComponent } from "./shared/titulo/titulo.component";

defineLocale('pt-br', ptBrLocale);

@NgModule({
  declarations: [
    AppComponent,
    PalestrantesComponent,
    NavbarComponent,
    DateFormatPipe,
    DateTimeFormatPipe,
    TituloComponent,
    EventosComponent,
    ContatosComponent,
    DashboardComponent,
    PerfilComponent,
    EventoDetalheComponent,
    EventoListaComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
      progressBar: true,
    }),
    NgxSpinnerModule,
    NgxCurrencyModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [EventoService, CssValidatorService, LoteService],
  bootstrap: [AppComponent],
})
export class AppModule { }
