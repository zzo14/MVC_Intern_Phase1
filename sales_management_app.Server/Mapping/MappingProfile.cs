using AutoMapper;
using sales_management_app.Server.Model;
using sales_management_app.Server.ViewModel;


namespace sales_management_app.Server.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Customer, customerViewModel>();
            CreateMap<Customer, createCustomerViewModel>();
            CreateMap<Product, productViewModel>();
            CreateMap<Product, createProductViewModel>();
            CreateMap<Store, storeViewModel>();
            CreateMap<Store, createStoreViewModel>();
            CreateMap<Sales, salesViewModel>();
            CreateMap<Sales, createSalesViewModel>();
        }
    }
}
