import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
}, { timestamps: true });

export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export interface ITag extends Document {
  name: string;
  slug: string;
}

const TagSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Tag: Model<ITag> = mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
  author: mongoose.Types.ObjectId;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  featuredImage: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  metaTitle: { type: String },
  metaDescription: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Indexing for search and performance
BlogSchema.index({ title: 'text', content: 'text' });
BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1 });

export const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
