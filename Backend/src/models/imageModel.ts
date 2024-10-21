import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  imageName: { type: String, required: true },
  imageData: { type: String, required: true },
});

const Image = mongoose.model('Image', imageSchema);

export default Image;