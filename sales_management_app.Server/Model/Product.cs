using System.Text.Json.Serialization;

namespace sales_management_app.Server.Model
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }

        public virtual ICollection<Sales> Sales { get; set; } = new List<Sales>();
    }
}
