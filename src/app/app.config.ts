import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {VievTableComponent} from "./table/viev-table.component";
import {TableComponent} from "./table/table.component";

const appRoutes: Routes =[
    { path: "", component: VievTableComponent},
    { path: "edit", component: TableComponent},
    { path: "**", redirectTo: "/"}
];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(appRoutes), provideClientHydration(), provideAnimationsAsync()]
};
