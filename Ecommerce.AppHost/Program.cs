var builder = DistributedApplication.CreateBuilder(args);

var products = builder.AddProject<Projects.Ecommerce_Product>("webapi-product")
.WithEnvironment("KAFKA_SERVER", "localhost:9092");

var orders = builder.AddProject<Projects.Ecommerce_Order>("webapi-order")
.WithEnvironment("KAFKA_SERVER", "localhost:9092"); ;

builder.AddNpmApp("angular-frontend", "../ECommerce.Angular")
    .WithReference(products)
    .WithReference(orders)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();
builder.Build().Run();
