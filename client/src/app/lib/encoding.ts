
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs-core';

export function encode(inputs : {queries:string[], responses:string[]}) {
    use.loadQnA().then(model => {
        let result = model.embed(inputs);
        const dp = tf.matMul(
            result['queryEmbedding'], 
            result['responseEmbedding'],
            false, true).dataSync();
        console.log(dp);
      });
}