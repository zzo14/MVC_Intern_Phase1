using Microsoft.EntityFrameworkCore;
using sales_management_app.Server.Model;

namespace sale_management_app.Models
{
    public class SalesDBContext : DbContext
    {
        public SalesDBContext(DbContextOptions<SalesDBContext> options) : base(options)
        {
        }
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<Sales> Sales { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Sales>()
                .HasOne<Product>(s => s.Product)
                .WithMany(p => p.Sales)
                .HasForeignKey(s => s.ProductId);

            modelBuilder.Entity<Sales>()
                .HasOne<Customer>(s => s.Customer)
                .WithMany(c => c.Sales)
                .HasForeignKey(s => s.CustomerId);

            modelBuilder.Entity<Sales>()
                .HasOne<Store>(s => s.Store)
                .WithMany(s => s.Sales)
                .HasForeignKey(s => s.StoreId);

            modelBuilder.Entity<Sales>()
                .Property(s => s.DateSold)
                .HasColumnType("dateTime");

            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18, 2)");
        }
    }
}
