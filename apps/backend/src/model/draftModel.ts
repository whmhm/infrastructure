import mongoose, { Document, Schema } from 'mongoose';
import { DraftInfo } from '../types/users';

// 扩展DraftInfo接口，使其与MongoDB文档兼容
export interface DraftDocument extends DraftInfo, Document {
  createdAt?: Date;
  updatedAt?: Date;
}

// 创建MongoDB的Schema
const DraftSchema = new Schema<DraftDocument>({
  userId: {
    type: Number,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true, // 自动添加createdAt和updatedAt字段
  id: true // 启用虚拟ID字段
});

// 将MongoDB的_id映射到id字段
DraftSchema.virtual('id').get(function(this: DraftDocument) {
  return this._id.toString();
});

// 确保虚拟字段包含在JSON输出中
DraftSchema.set('toJSON', { virtuals: true });
DraftSchema.set('toObject', { virtuals: true });

// 创建并导出模型
export const DraftModel = mongoose.model<DraftDocument>('Draft', DraftSchema);

// 导出CRUD操作方法
export const createDraft = async (draftData: Omit<DraftInfo, 'id'>): Promise<DraftDocument> => {
  const draft = new DraftModel(draftData);
  return await draft.save();
};

export const getDraftById = async (id: string): Promise<DraftDocument | null> => {
  return await DraftModel.findById(id).exec();
};

export const getDraftsByUserId = async (userId: number): Promise<DraftDocument[]> => {
  return await DraftModel.find({ userId }).sort({ createdAt: -1 }).exec();
};

export const updateDraft = async (id: string, draftData: Partial<DraftInfo>): Promise<DraftDocument | null> => {
  return await DraftModel.findByIdAndUpdate(id, draftData, { new: true }).exec();
};

export const deleteDraft = async (id: string): Promise<DraftDocument | null> => {
  return await DraftModel.findByIdAndDelete(id).exec();
};