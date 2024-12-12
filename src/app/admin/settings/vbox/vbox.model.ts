import { VBoxConfiguration } from '@elys/elys-api';

export interface ListVbox {
  totalPages?: number;
  actualPages?: number;
  totalVboxs: number;
  vBoxConfigurations: LocalVboxes[];
}


export interface LocalVboxes extends VBoxConfiguration {
  language?: string;

}


export interface LocalVBoxConfiguration extends LocalVboxes {
  vBoxMonitorSelectedIdx?: number;
}
