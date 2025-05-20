// MongoDB initialization script
// Creates initial collections and indexes

db = db.getSiblingDB('glizzy_gobbler');

// Create collections
db.createCollection('users');
db.createCollection('tenants');

// Create indexes for users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ isSystemAdmin: 1 });
db.users.createIndex({ 'tenantRoles.tenantId': 1 });

// Create indexes for tenants collection
db.tenants.createIndex({ name: 1 }, { unique: true });
db.tenants.createIndex({ slug: 1 }, { unique: true });
db.tenants.createIndex({ status: 1 });

// Create initial system admin user if it doesn't exist
const adminExists = db.users.findOne({ isSystemAdmin: true });

if (!adminExists) {
  db.users.insertOne({
    username: 'admin',
    email: 'admin@example.com',
    // Note: In a real application, this would be a securely hashed password
    // For development purposes only - this is a placeholder
    password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm', // '123456'
    isSystemAdmin: true,
    tenantRoles: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  print('Created initial system admin user');
} else {
  print('System admin user already exists, skipping creation');
}

// Create a default tenant if none exists
const defaultTenantExists = db.tenants.findOne();

if (!defaultTenantExists) {
  const defaultTenant = {
    name: 'Default Tenant',
    slug: 'default-tenant',
    description: 'Default tenant for the application',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = db.tenants.insertOne(defaultTenant);
  
  // If tenant is created successfully, assign admin as tenant admin
  if (result.acknowledged) {
    const tenantId = result.insertedId;
    
    db.users.updateOne(
      { isSystemAdmin: true },
      { $push: { tenantRoles: { tenantId: tenantId, role: 'admin' } } }
    );
    
    print('Created default tenant and assigned admin as tenant admin');
  }
} else {
  print('Tenants already exist, skipping default tenant creation');
}

print('MongoDB initialization completed');
