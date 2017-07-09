import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeekComponent } from './scheduler/week/week.component';
import { DayComponent } from './scheduler/day/day.component';
import { EventComponent } from './scheduler/event/event.component';

@NgModule({
  declarations: [
    AppComponent,
    WeekComponent,
    DayComponent,
    EventComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
