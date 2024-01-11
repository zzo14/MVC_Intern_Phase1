using System.Text.Json.Serialization;

namespace sales_management_app.Server.Model
{
    public class Sales
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public int StoreId { get; set; }
        public DateTime DateSold { get; set; }

        public virtual Product Product { get; set; } = null!;
        public virtual Customer Customer { get; set; } = null!;
        public virtual Store Store { get; set; } = null!;
    }
}
