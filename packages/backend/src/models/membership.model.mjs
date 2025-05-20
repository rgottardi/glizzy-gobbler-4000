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
    enum: ['Tenant Admin', 'Author', 'User'],
    required: true,
  },
}, { timestamps: true });

// Compound unique index to ensure a user has only one role per tenant
membershipSchema.index({ user: 1, tenant: 1 }, { unique: true });

const Membership = mongoose.model('Membership', membershipSchema);

export default Membership;
