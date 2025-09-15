import { PetProfile } from "./petProfile";

export type RootStackParamList = {
  PetsScreen: undefined;
  PetDetails: { pet: PetProfile };
};
