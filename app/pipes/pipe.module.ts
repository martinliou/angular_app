/* pipes.modules.ts */
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NoCommaPipe } from './custom.pipe';

@NgModule({
    declarations: [NoCommaPipe],
    imports: [IonicModule],
    exports: [NoCommaPipe]
})
export class PipesModule { }