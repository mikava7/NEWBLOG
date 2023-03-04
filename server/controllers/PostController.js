import PostModel from "../modules/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "posts were not found",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        message: "post not found",
      });
    }

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "can't get post",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      //pirveli 4s vigebt clientis requestidan
      title: req.body.title,
      text: req.body.text,
      imageURL: req.body.imageURL,
      tags: req.body.tags,
      //users vigebt bekendidan
      user: req.userId,
    });

    const post = await doc.save();
    console.log(post);
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "creating post failed",
    });
  }
};
