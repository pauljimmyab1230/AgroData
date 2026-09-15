export type CampoStackParamList = {
  CampoMain: undefined;
  Parcelas: { refresh?: boolean } | undefined;
  ParcelaDetail: { id: number };
  ParcelaForm: { id?: number } | undefined;
  Campanias: undefined;
  CampaniaDetail: { id: number };
  CampaniaForm: { id?: number } | undefined;
  Cultivos: undefined;
  CultivoDetail: { id: number };
  CultivoForm: { id?: number } | undefined;
  Inspecciones: { refresh?: boolean } | undefined;
  InspeccionDetail: { id: number };
  InspeccionForm: { id?: number } | undefined;
  Actividades: { refresh?: boolean } | undefined;
  ActividadDetail: { id: number };
  ActividadForm: { id?: number } | undefined;
  Acopios: { refresh?: boolean } | undefined;
  AcopioDetail: { id: number };
  AcopioForm: { id?: number } | undefined;
};

export type OperacionesStackParamList = {
  OperacionesMain: undefined;
  Recepciones: { refresh?: boolean } | undefined;
  RecepcionDetail: { id: number };
  RecepcionForm: { id?: number } | undefined;
  Procesamientos: { refresh?: boolean } | undefined;
  ProcesamientoDetail: { id: number };
  ProcesamientoForm: { id?: number } | undefined;
  Kardex: { refresh?: boolean } | undefined;
  KardexDetail: { id: number };
  KardexForm: { id?: number } | undefined;
};

export type ProductoresStackParamList = {
  ProductoresMain: undefined;
  ProductorCreate: undefined;
  ProductorDetail: { id: number };
  ProductorEdit: { id: number };
  Familiares: { productorId: number };
  FamiliarCreate: { productorId: number };
  FamiliarEdit: { id: number; productorId: number };
};

export type DashboardStackParamList = {
  DashboardMain: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  App: undefined;
};
