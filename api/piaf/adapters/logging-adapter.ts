import * as mongoose from "mongoose";
import * as Promise from "bluebird";
import * as _ from "lodash";
import loggingSchema from "../models/logging-model";

loggingSchema.static("getAll", (): Promise<any> => {
  return new Promise((resolve: Function, reject: Function) => {
    let _query = {};

    loggingAdapter.find(_query)
      .exec((err, todos) => {
        err ? reject(err)
          : resolve(todos);
      });
  });
});

loggingSchema.static("getSome", (): Promise<any> => {
  return new Promise((resolve: Function, reject: Function) => {
    let _query = {};

    loggingAdapter.find(_query).limit(100)
      .exec((err, todos) => {
        err ? reject(err)
          : resolve(todos);
      });
  });
});

loggingSchema.static("getByID", (id: string): Promise<any> => {
  return new Promise((resolve: Function, reject: Function) => {
    if (!id) {
      return reject(new TypeError("Not is not a valid object."));
    }

    loggingAdapter.findById(id)
      .exec((err, todo) => {
        err ? reject(err)
          : resolve(todo);
      });
  });
});

loggingSchema.static("getByBearer", (id: string): Promise<any> => {
  return new Promise((resolve: Function, reject: Function) => {
    if (!id) {
      return reject(new TypeError("Not is not a valid object."));
    }

    loggingAdapter.findOne({ "Bearer": id})
      .exec((err, todo) => {
        err ? reject(err)
          : resolve(todo);
      });
  });
});

loggingSchema.static("createOrUpdate", (anObject: any): Promise<any> => {
  return new Promise((resolve: Function, reject: Function) => {
    if (!_.isObject(anObject)) {
      return reject(new TypeError("supplied parameter is not a valid object"));
    }
    let NewObject = new loggingAdapter(anObject);
    NewObject.save((err, saved) => {
      err ? reject(err) : resolve(saved);
    })
  })
});

let loggingAdapter = mongoose.model("logs", loggingSchema);

export default loggingAdapter;
