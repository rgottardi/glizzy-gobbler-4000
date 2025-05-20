/**
 * Membership Model
 * 
 * Links users to tenants with specific roles.
 * This model enables multi-tenancy with RBAC (Role-Based Access Control).
 */
import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  role: {
    type: String,
    enum: ['tenantAdmin', 'author', 'user'],
    required: true,
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only have one role per tenant
membershipSchema.index({ user: 1, tenant: 1 }, { unique: true });

// Index for faster queries by tenant and role
membershipSchema.index({ tenant: 1, role: 1 });

// Index for looking up user's memberships
membershipSchema.index({ user: 1, isActive: 1 });

// Static method to find a user's active memberships
membershipSchema.statics.findUserMemberships = function(userId) {
  return this.find({ 
    user: userId,
    isActive: true 
  })
  .populate('tenant', 'name slug')
  .sort({ lastAccessed: -1 });
};

// Static method to check if a user is a member of a tenant with specific role
membershipSchema.statics.checkUserRole = async function(userId, tenantId, role) {
  const membership = await this.findOne({
    user: userId,
    tenant: tenantId,
    isActive: true
  });
  
  if (!membership) return false;
  
  // If checking for a specific role
  if (role) {
    return membership.role === role;
  }
  
  // Just checking if the user is a member
  return true;
};

// Instance method to update last accessed time
membershipSchema.methods.updateLastAccessed = async function() {
  this.lastAccessed = Date.now();
  return this.save();
};

const Membership = mongoose.model('Membership', membershipSchema);

export default Membership;
