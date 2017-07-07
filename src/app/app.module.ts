import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeekComponent } from './week.component';
import { DayComponent } from './day.component';
import { HourComponent } from './hour.component';
import { HourLabelComponent } from './hour-label.component';

@NgModule({
  declarations: [
    AppComponent,
    WeekComponent,
    DayComponent,
    HourComponent,
    HourLabelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
