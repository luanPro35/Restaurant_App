import { aiModel } from "./Ai.model";
import { encode } from "./Ai.encoder";

export function train(order: any[], allProductNames: string[]) {
    const trainingData = order.map((item: any) => {
        return {
            input: encode(item.product, allProductNames),
            output: { [item.product]: 1 }
        }
    });
    aiModel.train(trainingData, {
        iterations: 2000,
        errorThresh: 0.01,
    });
}