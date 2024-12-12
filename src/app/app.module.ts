import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ElysApiModule, PlaySource } from '@elys/elys-api';
import { ElysCouponModule } from '@elys/elys-coupon';
import { ElysStorageLibModule } from '@elys/elys-storage-lib';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QRCodeModule } from 'angular2-qrcode';
import { NgxBarcodeModule } from 'ngx-barcode';
import { environment } from '../environments/environment';
import { VERSION } from '../environments/version';
import { routes } from './app-routing.module';
import { componentDeclarations, providerDeclarations } from './app.common';
import { AppComponent } from './app.component';
import { ConfirmDestroyCouponComponent } from './component/coupon/confirm-destroy-coupon/confirm-destroy-coupon.component';
import { PayCancelDialogComponent } from './component/coupon/pay-cancel-dialog/pay-cancel-dialog.component';
import { LabelByGroupingPipe } from './component/pipe/label-by-grouping.pipe';
import { BetoddsComponent } from './products/product-dialog/betodds/betodds.component';
import { GroupingsComponent } from './products/product-dialog/groupings/groupings.component';
import { HotAndColdComponent } from './products/product-dialog/hot-and-cold/hot-and-cold.component';
import { AmericanrouletteComponent as AmericanrouletteHotAndColdComponent } from './products/product-dialog/hot-and-cold/template/americanroulette/americanroulette.component';
import { ColorsComponent as ColorsHotAndColdComponent } from './products/product-dialog/hot-and-cold/template/colors/colors.component';
import { KenoComponent as KenoHotAndColdComponent } from './products/product-dialog/hot-and-cold/template/keno/keno.component';
import { PaytableComponent } from './products/product-dialog/paytable/paytable.component';
import { ColoursComponent as ColoursPaytableComponent } from './products/product-dialog/paytable/template/colours/colours.component';
import { KenoComponent as KenoPaytableComponent } from './products/product-dialog/paytable/template/keno/keno.component';
import { ProductDialogComponent } from './products/product-dialog/product-dialog.component';
import { RankingComponent } from './products/product-dialog/ranking/ranking.component';
import { SoccerComponent as SoccerRankingComponent } from './products/product-dialog/ranking/templates/soccer/soccer.component';
import { StatisticsComponent } from './products/product-dialog/statistics/statistics.component';
import { CockFightComponent as CockFightStatisticsComponent } from './products/product-dialog/statistics/templates/cock-fight/cock-fight.component';
import { RaceComponent as RaceStatisticsComponent } from './products/product-dialog/statistics/templates/race/race.component';
import { SoccerComponent as SoccerStatisticsComponent } from './products/product-dialog/statistics/templates/soccer/soccer.component';
import { LanguageModule } from './shared/language/language.module';
import { SharedModule } from './shared/shared.module';
// tslint:disable-next-line:only-arrow-functions
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
@NgModule({
    declarations: [
        componentDeclarations,
        ProductDialogComponent,
        BetoddsComponent,
        StatisticsComponent,
        RaceStatisticsComponent,
        CockFightStatisticsComponent,
        SoccerStatisticsComponent,
        PaytableComponent,
        RankingComponent,
        SoccerRankingComponent,
        KenoPaytableComponent,
        ColoursPaytableComponent,
        ColorsHotAndColdComponent,
        HotAndColdComponent,
        KenoHotAndColdComponent,
        PayCancelDialogComponent,
        ConfirmDestroyCouponComponent,
        GroupingsComponent,
        LabelByGroupingPipe,
        AmericanrouletteHotAndColdComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        NoopAnimationsModule,
        MatDialogModule,
        MatSlideToggleModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        SharedModule,
        NgxBarcodeModule,
        QRCodeModule,
        ElysStorageLibModule.forRoot({
            isCrypto: true,
            cryptoString: 'VgenStorage',
            KeyUnencodedList: ['versionApp', 'operatorData', 'callBackURL'],
            versionStorage: VERSION.version
        }),
        ElysApiModule.forRoot({
            urlApi: environment.baseApiUrl
        }),
        ElysCouponModule.forRoot({ deviceLayout: PlaySource.VDeskWeb }),
        RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
        LanguageModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:10000'
        })
    ],
    providers: [
        providerDeclarations
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
