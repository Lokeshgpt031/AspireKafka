using System;
using Ecommerce.Model;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Order.Data;

public class OrderDbContext:DbContext
{

    public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options)
    {
        Database.EnsureCreated();
    }

    public DbSet<OrderModel> Orders { get; set; }
}
