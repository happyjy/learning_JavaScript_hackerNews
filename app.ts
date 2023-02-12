// // # point3 - TS - type alias
//  type Store = {
//   currentPage: number;
//   feeds: NewsList[];
// };

// // # point6 - TS - type extends
// type News = {
//   id: number;
//   time_ago: string;
//   title: string;
//   url: string;
//   user: string;
//   content: string;
// };

// type NewsList = News & {
//   comments_count: number;
//   points: number;
//   read?: boolean;
// };

// type NewsDetail = News & {
//   comments: NewsComment[];
// };

// type NewsComment = News & {
//   content: NewsComment[];
//   level: number;
// };

type Ta = {
  n: number;
};

type Tb = {
  nn: number;
};

type Tc = Ta | Tb;
// type Tc = Ta & Tb;

const obj: Tc = {
  n: 1,
  nn: 2,
};

interface Ia {
  n: number;
}
interface Ia {
  nn: number;
}

const obj1: Ia = {
  n: 1,
  nn: 2,
};

// # point7 - TS - interface, type alias
interface Store {
  currentPage: number;
  feeds: NewsFeed[];
}

// # point7 - TS - interface, type alias
interface News {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean;
}

interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}

// # point2 - TS - vscode에서 기본으로 제공하는 TS definition을 확인해서 TS작성
const container: HTMLElement | null = document.getElementById("root");
const ajax: XMLHttpRequest = new XMLHttpRequest();
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/@page.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const store: Store = {
  currentPage: 1,
  feeds: [],
};

// # point12 - TS - 상속을 활용한 getData function을 클래스로 변환
class Api {
  constructor(url: string) {
    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  protected getRequest<AjaxResponse>(): AjaxResponse {
    this.ajax.open("GET", this.url, false);
    this.ajax.send();

    return JSON.parse(this.ajax.response);
  }
}

class NewsFeedApi extends Api {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>();
  }
}
class NewsDetailApi extends Api {
  getData(): NewsDetail {
    return this.getRequest<NewsDetail>();
  }
}

// init();
window.addEventListener("hashchange", router);
router();

class NewsFeedView {
  api: NewsFeedApi;
  newsFeed: NewsFeed[];
  template: string;

  constructor() {
    this.api = new NewsFeedApi(NEWS_URL.replace("@page", store.currentPage));
    this.newsFeed = store.feeds;

    this.template = `
      <div class="bg-gray-600 min-h-screen">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
                <h2 style="padding-left:30px"> current page: {{__current_page__}}<h2>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                  Previous
                </a>
                <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                  Next
                </a>
              </div>
            </div> 
          </div>
        </div>
        <div class="p-4 text-2xl text-gray-700">
          {{__news_feed__}}        
        </div>
      </div>
    `;
  }
  render(): void {
    let newsList: string[] = [];
    let template = this.template;

    for (let news of this.newsFeed) {
      newsList.push(`
        <div class="p-6 ${
          news.read ? "bg-red-500" : "bg-white"
        } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
          <div class="flex">
            <div class="flex-auto">
              <a href="#/show/${news.id}">${news.title}</a>  
            </div>
            <div class="text-center text-sm">
              <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${
                news.comments_count
              }</div>
            </div>
          </div>
          <div class="flex mt-3">
            <div class="grid grid-cols-3 text-sm text-gray-500">
              <div><i class="fas fa-user mr-1"></i>${news.user}</div>
              <div><i class="fas fa-heart mr-1"></i>${news.points}</div>
              <div><i class="far fa-clock mr-1"></i>${news.time_ago}</div>
            </div>  
          </div>
        </div>    
      `);
    }

    template = template.replace("{{__news_feed__}}", newsList.join(""));
    template = template.replace(
      "{{__current_page__}}",
      String(store.currentPage)
    );
    template = template.replace(
      "{{__prev_page__}}",
      String(store.currentPage > 1 ? store.currentPage - 1 : 1)
    );
    template = template.replace(
      "{{__next_page__}}",
      String(store.currentPage + 1)
    );

    updateView(template);
    this.newsFeed = store.feeds = this.makeFeeds(api.getData());
  }
  makeFeeds(feeds: NewsFeed[]): NewsFeed[] {
    return feeds.map((feed) => ((feed.read = false), feed));
  }
}

class NewsDetailView {
  template: string;

  constructor() {
    // # point1 - Template literals
    this.template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
  
      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsDetail.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsDetail.content}
        </div>
  
        {{__comments__}}
  
      </div>
    </div>
  `;
  }

  render() {
    const id = getId();
    const api = new NewsDetailApi(CONTENT_URL.replace("@id", id));
    const newsDetail: NewsDetail = api.getData();

    for (let feed of store.feeds) {
      if (feed.id === Number(id)) {
        feed.read = true;
        break;
      }
    }

    updateView(
      this.template.replace(
        "{{__comments__}}",
        makeComment(newsDetail.comments)
      )
    );
  }

  makeComment(comments: NewsComment[]) {
    const commentString = [];

    for (let comment of comments) {
      // # point9 댓글
      commentString.push(`
      <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>      
    `);

      // # point9-1 대댓글
      if (comment.comments.length > 0) {
        // # point9-1 대댓글(재귀호출, 재귀호출로 넘기는 param-called)
        commentString.push(makeComment(comment.comments));
      }
    }

    return commentString.join("");
  }
}
function newsDetail() {}

/**
 * common function list
 *  - newsList, newsDetail, hashchange eventListener에서 사용되는 function
 */
// function init() {
//   store.currentPage = getId() || 1;
//   getNewsList();
// }

function updateView(html: string): void {
  if (container) {
    container.innerHTML = html;
  } else {
    console.error("최상위 컨테이너가 없어 UI를 진행하지 못합니다.");
  }
}

// function getNewsList() {
//   if (store.currentPage === getId() && store.feeds.length !== 0) {
//     return;
//   }
//   store.currentPage = getId();
//   store.feeds = makeFeeds(
//     getData<NewsFeed[]>(NEWS_URL.replace("@page", store.currentPage))
//   );
// }

function makeComment(comments: NewsComment[]): string {
  const commentString = [];

  for (let comment of comments) {
    // # point9 댓글
    commentString.push(`
    <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
      <div class="text-gray-400">
        <i class="fa fa-sort-up mr-2"></i>
        <strong>${comment.user}</strong> ${comment.time_ago}
      </div>
      <p class="text-gray-700">${comment.content}</p>
    </div>      
  `);

    // # point9-1 대댓글
    if (comment.comments.length > 0) {
      // # point9-1 대댓글(재귀호출, 재귀호출로 넘기는 param-called)
      commentString.push(makeComment(comment.comments));
    }
  }

  return commentString.join("");
}

// # point4 - router
function router() {
  const routePath = location.hash;

  if (routePath === "") {
    store.currentPage = getId();
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    // getNewsList();
    store.currentPage = getId();
    newsFeed();
  } else {
    newsDetail();
  }
}
// # point2: refactoring
// # point12 - TS - 상속을 활용한 getData function을 클래스로 변환
// function getData<AjaxResponse>(url: string): AjaxResponse {
//   // # point: 비동기 처리
//   ajax.open("GET", url, false);
//   ajax.send();

//   return JSON.parse(ajax.response);
// }

function getId() {
  return Number(location.hash.substring(7)) || 1;
}
