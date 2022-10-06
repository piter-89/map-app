export type Filters = {
  selectManufacturer?: string,
  selectModel?: string,
  selectOperator?: string,
  electricityOutputFrom?: number,
  electricityOutputTo?: number,
  rotorDiameterFrom?: number,
  rotorDiameterTo?: number,
  startDateFrom?: number,
  startDateTo?: number
}

export type TagValue = {
  name: string,
  value: string
}

export type Selects = {
  manufactures: Array<string>,
  model: Array<string>,
  operator: Array<string>
}