import { VBoxConfigurations } from "@elys/elys-api";

export const mockVBoxConfigurations: VBoxConfigurations = {
  VBoxConfigurations: [
    {
      MachineId: 123,
      VBoxMachineId: '123',
      MonitorConfigurations: [
        {
          MonitorId: 123,
          CategoryType: 'type',
          SportId: 8,
          Url: '',
          Language: 'en'
        }
      ],
      AvailableCategoryTypes: [
        {
          CategoryType: 'type',
          SportId: 8
        }
      ]
    }
  ]
};
