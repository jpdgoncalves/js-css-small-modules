const API_URL = "https://api.github.com";
const DEFAULT_HEADERS = new Headers({ "Accept": "application/vnd.github.v3+json" });


export class GithubUser {
    /**
     * 
     * @param {string} username 
     */
    constructor(username) {
        this.username = username;
    }

    /**
     * 
     * @param {number} perPage 
     * @param {number} page 
     * @returns 
     */
    async repos(perPage = 30, page = 1) {
        const queryArgs = new QueryArgs();
        queryArgs.set("per_page", perPage);
        queryArgs.set("page", page);

        const reposData = await APIRequest(`users/${this.username}/repos`, queryArgs);
        const repos = [];

        for (let repo of reposData) {
            const {name, full_name} = repo;
            repos.push(new Repository(this.username, name, full_name));
        }

        return repos;
    }

    /**
     * 
     * @param {string} name 
     */
    async repo(name) {
        const repoData = await APIRequest(`repos/${this.username}/${name}`);
        return new Repository(this.username, repoData.name, repoData.full_name);
    }
}


class Repository {
    /**
     * 
     * @param {string} userName
     * @param {string} name 
     * @param {string} fullName 
     */
    constructor(userName, name, fullName) {
        this.userName = userName;
        this.name = name;
        this.fullName = fullName;
    }

    /**
     * 
     * @param {string} [path]
     */
    async contents(path = "") {
        return await APIRequest(`repos/${this.fullName}/contents/${path}`);
    }

    /**
     * 
     * @param {string} [path] 
     * @returns {RepoDirectory[]}
     */
    async directories(path = "") {
        /**
         * @type {any[]}
         */
        const repoContents = await this.contents(path);
        return repoContents.filter(obj => obj.type === "dir")
                           .map(obj => new RepoDirectory(this.userName, this.name, obj.name, obj.path));
    }

    async directory(path = "") {
        const pathParts = path.split("/");
        return new RepoDirectory(this.userName, this.name, pathParts[pathParts.length - 1], path);
    }

    async files(path = "") {
        const repoContents = await this.contents(path);
        return repoContents.filter(obj => obj.type === "file")
                           .map(obj => new RepoFile(obj.name, obj.path, obj.downloadURL));
    }

    async file(path = "") {
        const fileData = await APIRequest(`repos/${this.fullName}/contents/${path}`);
        return new RepoFile(fileData.name, fileData.path, fileData.downloadURL);
    }
}


class RepoDirectory {
    /**
     * 
     * @param {string} userName 
     * @param {string} repoName 
     * @param {string} name 
     * @param {string} path
     */
    constructor(userName, repoName, name, path) {
        this.userName = userName;
        this.repoName = repoName;
        this.name = name;
        this.path = path;
    }

    async contents(path = "") {
        return await APIRequest(`repos/${this.userName}/${this.repoName}/contents/${this.path}/${path}`);
    }

    /**
     * 
     * @param {string} [path] 
     * @returns {RepoDirectory[]}
     */
    async directories(path = "") {
        /**
         * @type {any[]}
         */
        const repoContents = await this.contents(path);
        return repoContents.filter(obj => obj.type === "dir")
                           .map(obj => new RepoDirectory(this.userName, this.name, obj.name, obj.path));
    }

    async directory(path = "") {
        const pathParts = path.split("/");
        return new RepoDirectory(this.userName, this.name, pathParts[pathParts.length - 1], this.path + "/" + path);
    }

    async files(path = "") {
        const repoContents = await this.contents(path);
        return repoContents.filter(obj => obj.type === "file")
                           .map(obj => new RepoFile(obj.name, obj.path, obj.downloadURL));
    }

    async file(path = "") {
        const fileData = await APIRequest(`repos/${this.userName}/${this.repoName}/contents/${this.path}/${path}`);
        return new RepoFile(fileData.name, fileData.path, fileData.downloadURL);
    }
}


class RepoFile {
    /**
     * 
     * @param {string} name 
     * @param {string} path 
     * @param {string} downloadURL 
     */
    constructor(name, path, downloadURL) {
        this.name = name;
        this.path = path;
        this.downloadURL = downloadURL;
    }
}


class QueryArgs {
    constructor() {
        this.args = new Map();
    }

    /**
     * 
     * @param {string} name 
     * @param {string} value 
     */
    set(name, value) {
        this.args.set(name, value);
    }

    toString() {
        const stringBuilder = [];
        for (let [name, value] of this.args.entries()) {
            stringBuilder.push(`${name}=${value}`);
        }

        return stringBuilder.join("&");
    }
}


/**
 * 
 * @param {string} uri 
 * @param {QueryArgs} [queryArgs]
 */
async function APIRequest(uri, queryArgs) {
    const queryString = queryArgs !== undefined ? "?" + queryArgs.toString() : "";
    const requestURL = `${API_URL}/${uri}${queryString}`;
    const response = await fetch(requestURL, { headers: DEFAULT_HEADERS});
    if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
    }
    return await response.json();
}
