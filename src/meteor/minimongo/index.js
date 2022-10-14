import LocalCollection_ from './local_collection.js';
import Matcher from './matcher.js';
import Sorter from './sorter.js';

const Minimongo = {
    LocalCollection: LocalCollection_,
    Matcher,
    Sorter
};

window.LocalCollection = LocalCollection_;
window.Minimongo = Minimongo;

export {
    LocalCollection_ as LocalCollection,
    Minimongo,
}