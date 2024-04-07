import { TextLoader } from "langchain/document_loaders/fs/text";

// Loads data from text files
export const run = async () => {
  const loader = new TextLoader("the_black_box.txt");
  //const loader = new TextLoader("src/prompt.txt");
  const docs = await loader.load();
  console.log({ docs });
  /**
   * {
   *   docs: [
   *     {
   *       pageContent: 'this is an example text to see how langchain loads raw text.',
   *       metadata: {}
   *     }
   *   ]
   * }
   */
};
