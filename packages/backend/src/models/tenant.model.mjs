import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  settings: { 
    type: Object, 
    default: {} 
  },
}, { timestamps: true });

// Pre-save hook to generate slug if not provided
tenantSchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  
  // If slug not set, generate from name
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, '-')      // Replace spaces with -
      .replace(/[^\w-]+/g, '')   // Remove non-word chars
      .replace(/--+/g, '-')      // Replace multiple - with single -
      .trim();
  }
  
  next();
});

const Tenant = mongoose.model('Tenant', tenantSchema);

export default Tenant;
