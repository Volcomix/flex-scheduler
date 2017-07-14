import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import * as moment from 'moment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeekComponent } from './scheduler/week/week.component';
import { EventComponent } from './scheduler/event/event.component';

const locale = 'fr';

moment.locale(locale);

@NgModule({
  declarations: [
    AppComponent,
    WeekComponent,
    EventComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: locale }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
