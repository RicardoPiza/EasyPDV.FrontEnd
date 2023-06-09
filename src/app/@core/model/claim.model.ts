export class Claim {

    Id: string = "";
    Created: string = "";
    ExternalIdUser: string = "";
    ExternalIdEmail: string = "";
    MarketDefault: string = "";
    Profile: string = "";
    Companies: Array<Company> = [];
    LineOfProducts: Array<LineOfProduct> = [];
    UnitsOfSale: Array<UnitOfSale> = [];
    EconomicGroups: Array<EconomicGroup> = [];
    Customers: Array<Customer> = [];
    GroupsOfPermission: Array<GroupOfPermission> = [];
    Markets: Array<Market> = [];
    Departments: Array<Department> = [];    
    Modules: Array<Module> = [];
    CostCenters: Array<CostCenter> = [];
    
    constructor(
        id?: string,
        created?: string,
        externalIdUser?: string,
        externalIdEmail?: string,
        marketDefault?:string,
        companies?: Array<Company>,
        lineOfProducts?: Array<LineOfProduct>,
        unitsOfSale?: Array<UnitOfSale>,
        economicGroups?: Array<EconomicGroup>,
        customers?: Array<Customer>,
        groupsOfPermission?: Array<GroupOfPermission>,
        markets?: Array<Market>,
        departments?: Array<Department>
    ) {
        this.Id = id!;
        this.Created = created!;
        this.ExternalIdUser = externalIdUser!;
        this.ExternalIdEmail = externalIdEmail!;
        this.MarketDefault = marketDefault!;
        this.Companies = companies!;
        this.LineOfProducts = lineOfProducts!;
        this.UnitsOfSale = unitsOfSale!;
        this.EconomicGroups = economicGroups!;
        this.Customers = customers!;
        this.GroupsOfPermission = groupsOfPermission!;
        this.Markets = markets!;
        this.Departments = departments!;
    }


}

export class Company {
    Id: string = "";
    DateTime: string = "";
    ExternalIdCompany: string = "";
    Description: string = "";
    NickName: string = "";
}

export class LineOfProduct {
    Id: string = "";
    DateTime: string = "";
    ExternalIdLineOfProduct: string = "";
    Description: string = "";
}

export class UnitOfSale {
    Id: string = "";
    DateTime: string = "";
    ExternalIdUnitOfSale: string = "";
    Description: string = "";
    VisibilityComplete: boolean = false;
}

export class EconomicGroup {
    Id: string = "";
    DateTime: string = "";
    ExternalIdEconomicGroup: string = "";
    Description: string = "";
}

export class Customer {
    Id: string = "";
    DateTime: string = "";
    ExternalIdCustomer: string = "";
    Description: string = "";
}

export class GroupOfPermission {
    Id: string = "";
    DateTime: string = "";
    ExternalIdGroupOfPermission: string = "";
}

export class Market {
    ExternalIdMarket: string = "";
    Default: boolean = false;   
}

export class Department {
    ExternalIdDepartment: string = "";
    Description: string = ""; 
}

export class Module{
    ModuleId: string = '';
    Description: string = '';    
}

export class CostCenter {
    CompanyId: number = 0;
    CostCenterNumber: number = 0;   
    Key: string = '';
}