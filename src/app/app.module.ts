import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeekComponent } from './scheduler/week/week.component';
import { DayComponent } from './scheduler/day/day.component';

@NgModule({
  declarations: [
    AppComponent,
    WeekComponent,
    DayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
