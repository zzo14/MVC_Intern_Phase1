using System.Text.Json.Serialization;

namespace sales_management_app.Server.Model
{
    public class Store
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }

        public virtual ICollection<Sales> Sales { get; set; } = new List<Sales>();
    }
}
