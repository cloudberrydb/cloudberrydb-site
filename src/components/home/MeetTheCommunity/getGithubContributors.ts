async function fetchGithubNum(url) {
  let allCommits = [];
  while (url) {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.message);
    }
    allCommits = allCommits.concat(data);
    const link = response.headers.get("link");
    url = link ? extractNextUrl(link) : null;
  }
  return allCommits;
}

function extractNextUrl(linkHeader) {
  const links = linkHeader.split(",");
  for (const link of links) {
    if (link.includes('rel="next"')) {
      const urlMatch = link.match(/<(.*)>/);
      if (urlMatch) {
        return urlMatch[1];
      }
    }
  }
  return null;
}

const baseGithubUrl = "https://api.github.com/repos";
const repoName = "cloudberrydb/cloudberrydb";

const business = "contributors";
const key = "GITHUB_CONTRIBUTORS";

export interface ContributorItem {
  avatarURL: string;
  htmlURL: string;
  id: number;
}
interface CacheObj {
  time: number;
  list: ContributorItem[];
}

export default async function getGithubContributors(): Promise<
  ContributorItem[]
> {
  let cacheObj: CacheObj | null = null;
  try {
    const cacheStr = localStorage.getItem(key);
    cacheObj = cacheStr ? JSON.parse(cacheStr) : null;
  } catch (err) {
    localStorage.removeItem(key);
    console.error(err);
  }

  if (!isNeedReqNewApi(cacheObj)) {
    if (!cacheObj?.list.length) {
      localStorage.removeItem(key);
      return [];
    }
    return cacheObj.list;
  }

  try {
    const dataList = await fetchGithubNum(
      `${baseGithubUrl}/${repoName}/${business}`
    );
    const list = dataList.map((item) => {
      return {
        avatarURL: item.avatar_url,
        htmlURL: item.html_url,
        id: item.id,
      };
    });

    if (list.length) {
      const catchObj: CacheObj = {
        time: new Date().getTime(),
        list: list,
      };
      localStorage.setItem(key, JSON.stringify(catchObj));
    } else {
      if (cacheObj.list) {
        return cacheObj.list;
      }
    }
    return list;
  } catch (err) {
    return [];
  }
}

function isNeedReqNewApi(cacheStr: CacheObj | null) {
  // one hour cache
  return !cacheStr || new Date().getTime() - cacheStr.time > 1000 * 60 * 60;
}
