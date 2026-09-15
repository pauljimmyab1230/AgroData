import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/DashboardScreen";
import ProductoresScreen from "../screens/ProductoresScreen";
import ProductorDetailScreen from "../screens/ProductorDetailScreen";
import ProductorCreateScreen from "../screens/ProductorCreateScreen";
import ProductorEditScreen from "../screens/ProductorEditScreen";
import FamiliaresScreen from "../screens/FamiliaresScreen";
import FamiliarCreateScreen from "../screens/FamiliarCreateScreen";
import FamiliarEditScreen from "../screens/FamiliarEditScreen";
import CampoScreen from "../screens/CampoScreen";
import ParcelasScreen from "../screens/ParcelasScreen";
import ParcelaDetailScreen from "../screens/ParcelaDetailScreen";
import ParcelaFormScreen from "../screens/ParcelaFormScreen";
import CampaniasScreen from "../screens/CampaniasScreen";
import CampaniaDetailScreen from "../screens/CampaniaDetailScreen";
import CampaniaFormScreen from "../screens/CampaniaFormScreen";
import CultivosScreen from "../screens/CultivosScreen";
import CultivoDetailScreen from "../screens/CultivoDetailScreen";
import CultivoFormScreen from "../screens/CultivoFormScreen";
import InspeccionesScreen from "../screens/InspeccionesScreen";
import InspeccionDetailScreen from "../screens/InspeccionDetailScreen";
import InspeccionFormScreen from "../screens/InspeccionFormScreen";
import ActividadesScreen from "../screens/ActividadesScreen";
import ActividadDetailScreen from "../screens/ActividadDetailScreen";
import ActividadFormScreen from "../screens/ActividadFormScreen";
import OperacionesScreen from "../screens/OperacionesScreen";
import RecepcionesScreen from "../screens/RecepcionesScreen";
import RecepcionDetailScreen from "../screens/RecepcionDetailScreen";
import RecepcionFormScreen from "../screens/RecepcionFormScreen";
import AcopiosScreen from "../screens/AcopiosScreen";
import AcopioDetailScreen from "../screens/AcopioDetailScreen";
import AcopioFormScreen from "../screens/AcopioFormScreen";

const screenOptions = { headerShown: false };

const DashboardNativeStack = createNativeStackNavigator();
const ProductoresNativeStack = createNativeStackNavigator();
const CampoNativeStack = createNativeStackNavigator();

export const DashboardStack = React.memo(() => (
  <DashboardNativeStack.Navigator screenOptions={screenOptions}>
    <DashboardNativeStack.Screen name="DashboardMain" component={DashboardScreen} />
  </DashboardNativeStack.Navigator>
));

export const ProductoresStack = React.memo(() => (
  <ProductoresNativeStack.Navigator screenOptions={screenOptions}>
    <ProductoresNativeStack.Screen name="ProductoresMain" component={ProductoresScreen} />
    <ProductoresNativeStack.Screen name="ProductorCreate" component={ProductorCreateScreen} />
    <ProductoresNativeStack.Screen name="ProductorDetail" component={ProductorDetailScreen} />
    <ProductoresNativeStack.Screen name="ProductorEdit" component={ProductorEditScreen} />
    <ProductoresNativeStack.Screen name="Familiares" component={FamiliaresScreen} />
    <ProductoresNativeStack.Screen name="FamiliarCreate" component={FamiliarCreateScreen} />
    <ProductoresNativeStack.Screen name="FamiliarEdit" component={FamiliarEditScreen} />
  </ProductoresNativeStack.Navigator>
));

export const CampoStack = React.memo(() => (
  <CampoNativeStack.Navigator screenOptions={screenOptions}>
    <CampoNativeStack.Screen name="CampoMain" component={CampoScreen} />
    <CampoNativeStack.Screen name="Parcelas" component={ParcelasScreen} />
    <CampoNativeStack.Screen name="ParcelaDetail" component={ParcelaDetailScreen} />
    <CampoNativeStack.Screen name="ParcelaForm" component={ParcelaFormScreen} />
    <CampoNativeStack.Screen name="Campanias" component={CampaniasScreen} />
    <CampoNativeStack.Screen name="CampaniaDetail" component={CampaniaDetailScreen} />
    <CampoNativeStack.Screen name="CampaniaForm" component={CampaniaFormScreen} />
    <CampoNativeStack.Screen name="Cultivos" component={CultivosScreen} />
    <CampoNativeStack.Screen name="CultivoDetail" component={CultivoDetailScreen} />
    <CampoNativeStack.Screen name="CultivoForm" component={CultivoFormScreen} />
    <CampoNativeStack.Screen name="Inspecciones" component={InspeccionesScreen} />
    <CampoNativeStack.Screen name="InspeccionDetail" component={InspeccionDetailScreen} />
    <CampoNativeStack.Screen name="InspeccionForm" component={InspeccionFormScreen} />
    <CampoNativeStack.Screen name="Actividades" component={ActividadesScreen} />
    <CampoNativeStack.Screen name="ActividadDetail" component={ActividadDetailScreen} />
    <CampoNativeStack.Screen name="ActividadForm" component={ActividadFormScreen} />
    <CampoNativeStack.Screen name="Acopios" component={AcopiosScreen} />
    <CampoNativeStack.Screen name="AcopioDetail" component={AcopioDetailScreen} />
    <CampoNativeStack.Screen name="AcopioForm" component={AcopioFormScreen} />
  </CampoNativeStack.Navigator>
));

const OperacionesNativeStack = createNativeStackNavigator();

export const OperacionesStack = React.memo(() => (
  <OperacionesNativeStack.Navigator screenOptions={screenOptions}>
    <OperacionesNativeStack.Screen name="OperacionesMain" component={OperacionesScreen} />
    <OperacionesNativeStack.Screen name="Recepciones" component={RecepcionesScreen} />
    <OperacionesNativeStack.Screen name="RecepcionDetail" component={RecepcionDetailScreen} />
    <OperacionesNativeStack.Screen name="RecepcionForm" component={RecepcionFormScreen} />
  </OperacionesNativeStack.Navigator>
));
