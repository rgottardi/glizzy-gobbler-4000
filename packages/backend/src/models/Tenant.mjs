/**
 * Tenant Model
 * 
 * Defines the schema for tenants in the multi-tenant application.
 * Each tenant represents a separate organization or workspace.
 */
import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tenant name is required'],
    trim: true,
    maxlength: [100, 'Tenant name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Tenant slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    maxlength: [50, 'Slug cannot exceed 50 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    allowUserRegistration: {
      type: Boolean,
      default: false
    },
    defaultUserRole: {
      type: String,
      enum: ['user', 'author'],
      default: 'user'
    },
    // Additional tenant settings can be added here
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for faster queries
tenantSchema.index({ slug: 1 });
tenantSchema.index({ createdBy: 1 });

// Static method to find tenant by slug
tenantSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isActive: true });
};

const Tenant = mongoose.model('Tenant', tenantSchema);

export default Tenant;
