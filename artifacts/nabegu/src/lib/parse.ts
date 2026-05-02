import Parse from "parse";

const APP_ID = import.meta.env.VITE_BACK4APP_APP_ID ?? "";
const JS_KEY = import.meta.env.VITE_BACK4APP_JS_KEY ?? "";

export const isConfigured =
  APP_ID.length > 0 &&
  APP_ID !== "YOUR_APP_ID_HERE" &&
  JS_KEY.length > 0 &&
  JS_KEY !== "YOUR_JS_KEY_HERE";

if (isConfigured) {
  Parse.initialize(APP_ID, JS_KEY);
  Parse.serverURL = "https://parseapi.back4app.com";
}

export { Parse };

export async function fetchClass<T extends Record<string, unknown>>(
  className: string,
  params?: { where?: object; order?: string; limit?: number }
): Promise<T[]> {
  if (!isConfigured) throw new Error("Back4App not configured");
  const query = new Parse.Query(className);
  if (params?.where) {
    Object.entries(params.where).forEach(([k, v]) => query.equalTo(k, v));
  }
  if (params?.order) query.descending(params.order.replace(/^-/, ""));
  if (params?.limit) query.limit(params.limit);
  const results = await query.find();
  return results.map((obj) => ({ objectId: obj.id, ...obj.attributes })) as T[];
}

export async function createObject(
  className: string,
  data: Record<string, unknown>
): Promise<{ objectId: string }> {
  if (!isConfigured) throw new Error("Back4App not configured");
  const Obj = Parse.Object.extend(className);
  const instance = new Obj();
  Object.entries(data).forEach(([k, v]) => instance.set(k, v));
  const result = await instance.save();
  return { objectId: result.id };
}
