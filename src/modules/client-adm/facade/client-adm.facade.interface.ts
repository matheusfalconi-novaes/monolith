export interface AddClientFacedeInputDto {
  id?: string;
  name: string;
  email: string;
  document: string;
  street: string;
  city: string;
  complement: string;
  number: number;
  state: string;
  zipCode: string;
}

export interface FindClientFacadeInputDto {
  id: string;
}

export interface FindClientFacadeOutputDto {
  id: string;
  name: string;
  email: string;
  document: string;
  street: string;
  city: string;
  complement: string;
  number: number;
  state: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export default interface ClientAdmFacadeInterface {
  add(input: AddClientFacedeInputDto): Promise<void>;
  find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto>;
}
