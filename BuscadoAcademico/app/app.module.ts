import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { AppComponent } from "./app.component";
import * as platform from 'platform';
import { BuscadorComponent } from './buscador/buscador.component';
import { BuscadorService } from "./services/buscador.services";
import { LocationService } from "./services/location.services";

// import { ItemService } from "./item/item.service";
// import { ItemsComponent } from "./item/items.component";
// import { ItemDetailComponent } from "./item/item-detail.component";

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

declare var GMSServices: any

if (platform.isIOS) {
    GMSServices.provideAPIKey("AIzaSyAeYQmaOx9u8N9q1prX8LYaGXK4fNpBma8")
}


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        BuscadorComponent
        // ItemsComponent,
        // ItemDetailComponent
    ],
    providers: [
        // ItemService
        BuscadorService,
        LocationService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
