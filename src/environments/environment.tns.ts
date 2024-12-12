import { Environment } from './environment.models';
import { environment as devEnvironment } from './environment';
// apuestas dominicanas
import { environment as apuestasDominicanasEnvironment } from './environment.apuestas-dominicanas';
import { environment as apuestasDominicanasStagingEnvironment } from './environment.apuestas-dominicanas-staging';
// BETCONNECTION
import { environment as betconnectionEnvironment } from './environment.betconnection';
import { environment as betconnectionStagingEnvironment } from './environment.betconnection-staging';
// BETESE
import { environment as beteseEnvironment } from './environment.betese';
import { environment as beteseStagingEnvironment } from './environment.betese-staging';
// betlogik
import { environment as betlogikEnvironment } from './environment.betlogik';
import { environment as betlogikStagingEnvironment } from './environment.betlogik-staging';
// betpro
import { environment as betproEnvironment } from './environment.betpro';
import { environment as betproStagingEnvironment } from './environment.betpro-staging';
// betsafi
import { environment as betsafiEnvironment } from './environment.betsafi';
import { environment as betsafiStagingEnvironment } from './environment.betsafi-staging';
// betsplus
import { environment as betsplusEnvironment } from './environment.betsplus';
import { environment as betsplusStagingEnvironment } from './environment.betsplus-staging';
// bolivarbet
import { environment as bolivarbetEnvironment } from './environment.bolivarbet';
import { environment as bolivarbetStagingEnvironment } from './environment.bolivarbet-staging';
// doradobet
import { environment as doradobetEnvironment } from './environment.doradobet';
import { environment as doradobetStagingEnvironment } from './environment.doradobet-staging';
// f2o
import { environment as f2oEnvironment } from './environment.f2o';
import { environment as f2oStagingEnvironment } from './environment.f2o-staging';
// genc01
import { environment as genc01Environment } from './environment.genc01';
import { environment as genc01StagingEnvironment } from './environment.genc01-staging';
// genc02
import { environment as genc02Environment } from './environment.genc02';
import { environment as genc02StagingEnvironment } from './environment.genc02-staging';
// genc03
import { environment as genc03Environment } from './environment.genc03';
import { environment as genc03StagingEnvironment } from './environment.genc03-staging';
// genc04
import { environment as genc04Environment } from './environment.genc04';
import { environment as genc04StagingEnvironment } from './environment.genc04-staging';
// homerun
import { environment as homerunEnvironment } from './environment.homerun';
import { environment as homerunStagingEnvironment } from './environment.homerun-staging';
// kyron
import { environment as kyronEnvironment } from './environment.kyron';
import { environment as kyronStagingEnvironment } from './environment.kyron-staging';
// mayabet
import { environment as mayabetEnvironment } from './environment.mayabet';
import { environment as mayabetStagingEnvironment } from './environment.mayabet-staging';

// oneway
import { environment as onewayEnvironment } from './environment.oneway';
import { environment as onewayStagingEnvironment } from './environment.oneway-staging';
import { environment as prodEnvironment } from './environment.prod';
// shawis
import { environment as shawisEnvironment } from './environment.shawis';
import { environment as shawisStagingEnvironment } from './environment.shawis-staging';
// soccerbet
import { environment as soccerbetEnvironment } from './environment.soccerbet';
import { environment as soccerbetStagingEnvironment } from './environment.soccerbet-staging';
// soft
import { environment as softEnvironment } from './environment.soft';
import { environment as softStagingEnvironment } from './environment.soft-staging';
// sportrace
import { environment as sportraceEnvironment } from './environment.sportrace';
import { environment as sportraceStagingEnvironment } from './environment.sportrace-staging';
// tradabet
import { environment as tradabetsEnvironment } from './environment.tradabets';
import { environment as tradabetsStagingEnvironment } from './environment.tradabets-staging';
// uganbet
import { environment as uganbetEnvironment } from './environment.uganbet';
import { environment as uganbetStagingEnvironment } from './environment.uganbet-staging';
// universalsoft
import { environment as universalSoftEnvironment } from './environment.universalsoft';
import { environment as universalSoftStagingEnvironment } from './environment.universalsoft-staging';
// VGEN
import { environment as vgenEnvironment } from './environment.vgen';
import { environment as vgenStagingEnvironment } from './environment.vgen-staging';

export const environment: Environment = (() => {
  let envVars;

  if (
    typeof process !== 'undefined' &&
    process &&
    Object.prototype.hasOwnProperty.call(process, 'env') &&
    process.env &&
    Object.prototype.hasOwnProperty.call(process.env, 'environment') &&
    process.env.environment
  ) {
    switch (process.env.environment) {
      case 'prod':
        envVars = prodEnvironment;
        break;
      case 'vgen-prod':
        envVars = vgenEnvironment;
        break;
      case 'vgen-staging':
        envVars = vgenStagingEnvironment;
        break;
      case 'shawis-prod':
        envVars = shawisEnvironment;
        break;
      case 'shawis-staging':
        envVars = shawisStagingEnvironment;
        break;
      case 'oneway-prod':
        envVars = onewayEnvironment;
        break;
      case 'oneway-staging':
        envVars = onewayStagingEnvironment;
        break;
      case 'universalsoft-prod':
        envVars = universalSoftEnvironment;
        break;
      case 'universalsoft-staging':
        envVars = universalSoftStagingEnvironment;
        break;
      case 'mayabet-prod':
        envVars = mayabetEnvironment;
        break;
      case 'mayabet-staging':
        envVars = mayabetStagingEnvironment;
        break;
      case 'genc01-prod':
        envVars = genc01Environment;
        break;
      case 'genc01-staging':
        envVars = genc01StagingEnvironment;
        break;
      case 'genc02-prod':
        envVars = genc02Environment;
        break;
      case 'genc02-staging':
        envVars = genc02StagingEnvironment;
        break;
      case 'genc03-prod':
        envVars = genc03Environment;
        break;
      case 'genc03-staging':
        envVars = genc03StagingEnvironment;
        break;
      case 'genc04-prod':
        envVars = genc04Environment;
        break;
      case 'genc04-staging':
        envVars = genc04StagingEnvironment;
        break;
        case 'betconnection-prod':
          envVars = betconnectionEnvironment;
          break;
        case 'betconnection-staging':
          envVars = betconnectionStagingEnvironment;
          break;
      case 'betese-prod':
        envVars = beteseEnvironment;
        break;
      case 'betese-staging':
        envVars = beteseStagingEnvironment;
        break;
      case 'sportrace-prod':
        envVars = sportraceEnvironment;
        break;
      case 'sportrace-staging':
        envVars = sportraceStagingEnvironment;
        break;
      case 'bolivarbet-prod':
        envVars = bolivarbetEnvironment;
        break;
      case 'bolivarbet-staging':
        envVars = bolivarbetStagingEnvironment;
        break;
      case 'apuestas-dominicanas-prod':
        envVars = apuestasDominicanasEnvironment;
        break;
      case 'apuestas-dominicanas-staging':
        envVars = apuestasDominicanasStagingEnvironment;
        break;
      case 'f2o-prod':
        envVars = f2oEnvironment;
        break;
      case 'f2o-staging':
        envVars = f2oStagingEnvironment;
        break;
      case 'soft-prod':
        envVars = softEnvironment;
        break;
      case 'soft-staging':
        envVars = softStagingEnvironment;
        break;
      case 'kyron-prod':
        envVars = kyronEnvironment;
        break;
      case 'kyron-staging':
        envVars = kyronStagingEnvironment;
        break;
      case 'homerun-prod':
        envVars = homerunEnvironment;
        break;
      case 'homerun-staging':
        envVars = homerunStagingEnvironment;
        break;
      case 'betlogik-prod':
        envVars = betlogikEnvironment;
        break;
      case 'betlogik-staging':
        envVars = betlogikStagingEnvironment;
        break;
      case 'doradobet-prod':
        envVars = doradobetEnvironment;
        break;
      case 'doradobet-staging':
        envVars = doradobetStagingEnvironment;
        break;
      case 'uganbet-prod':
        envVars = uganbetEnvironment;
        break;
      case 'uganbet-staging':
        envVars = uganbetStagingEnvironment;
        break;
      case 'soccerbet-prod':
        envVars = soccerbetEnvironment;
        break;
      case 'soccerbet-staging':
        envVars = soccerbetStagingEnvironment;
        break;
      case 'betsafi-prod':
        envVars = betsafiEnvironment;
        break;
      case 'betsafi-staging':
        envVars = betsafiStagingEnvironment;
        break;
      case 'tradabets-prod':
        envVars = tradabetsEnvironment;
        break;
      case 'tradabets-staging':
        envVars = tradabetsStagingEnvironment;
        break;
      case 'betsplus-prod':
        envVars = betsplusEnvironment;
        break;
      case 'betsplus-staging':
        envVars = betsplusStagingEnvironment;
        break;
      case 'betpro-prod':
        envVars = betproEnvironment;
        break;
      case 'betpro-staging':
        envVars = betproStagingEnvironment;
        break;
      default:
        envVars = devEnvironment;
    }
  } else {
    envVars = devEnvironment;
  }

  return envVars;
})();
