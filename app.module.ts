import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolsComponent } from './tools/tools.component';
import { ScoreComponent } from './score/score.component';
import { ActionsComponent } from './actions/actions.component';
import { GamescreenComponent } from './gamescreen/gamescreen.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolsComponent,
    ScoreComponent,
    ActionsComponent,
    GamescreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
