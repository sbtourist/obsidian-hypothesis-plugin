
import { settingsStore, syncSessionStore } from '~/store';
import { get } from 'svelte/store';
import { Notice, moment } from 'obsidian';
import axios from "axios";

export default class ApiManager {
  readonly baseUrl: string = 'https://hypothes.is/api';
  private token: string;
  private userid: string;

  constructor(token: string, userid: string = undefined) {
    this.token = token;
    this.userid = userid;
  }

  private getHeaders() {
    return {
      'AUTHORIZATION': `Bearer ${this.token}`,
      'Accept': 'application/json',
    };
  }

  async getProfile() {
    try {
      const response = await axios.get(`${this.baseUrl}/profile`, { headers: this.getHeaders() })
      return response.data.userid
    }
    catch (e) {
      new Notice('Failed to authorize Hypothes.is user. Please check your API token and try again.')
      console.error(e);
      return;
    }
  }

  async getHighlights(lastSyncDate?: Date, limit = 1000) {
    try {
      const shouldOverwrite = await get(settingsStore).overwriteOnUpdate;
      const newestTimestamp = lastSyncDate && moment.utc(lastSyncDate).toDate();
      const newestTimestampISO = newestTimestamp && newestTimestamp.toISOString();

      let annotations = [];
      if (!shouldOverwrite) {
        console.log(`Updating new annotations since last sync date ${newestTimestampISO}`);
        annotations = await this.doGetUpdatedHighlights(newestTimestamp, limit);
      }
      else if (shouldOverwrite && !newestTimestamp) {
        console.log("Overwriting all annotations");
        annotations = await this.doGetUpdatedHighlights(null);
      }
      else {
        const updatedUris = await this.doGetUpdatedUris(newestTimestamp, limit);
        console.log(`Overwriting all annotations from ${updatedUris.size} updated URIs since last sync date ${newestTimestampISO}`);

        const promises = [];
        updatedUris.forEach((v, k, r) => promises.push(this.getHighlightsWithUri(v)));
        for (let index = 0; index < promises.length; index++) {
          const newAnnotations = await promises[index];
          annotations = [ ...annotations, ...newAnnotations ];
        }
      }

      if (annotations.length == limit) {
        new Notice('Reached annotations limit, please manually sync again.')
      }
      if (annotations.length > 0) {
        settingsStore.actions.setLastSyncedAnnotation(new Date(annotations[annotations.length - 1].updated))
      }

      return annotations;
    } catch (e) {
      new Notice('Failed to fetch Hypothes.is annotations. Please check your API token and try again.')
      console.error(e);
      throw e;
    }
  }

  private async doGetUpdatedHighlights(searchAfter: Date, limit = 1000) {
    try {
      let annotations = [];

      // Paginate API calls via search_after param
      // search_after=null starts at with the earliest annotations
      while (annotations.length < limit) {
        const response = await axios.get(
          `${this.baseUrl}/search`,
          {
            params: {
              limit: 200, // Max pagination size do not change
              sort: "updated",
              order: "asc", // Get all annotations since search_after
              search_after: searchAfter && searchAfter.toISOString(),
              user: this.userid,
            },
            headers: this.getHeaders()
          }
        )
        const newAnnotations = response.data.rows;
        if (!newAnnotations.length) {
          break;
        }

        annotations = [ ...annotations, ...newAnnotations ];
        searchAfter = new Date(newAnnotations[newAnnotations.length - 1].updated);
      }

      console.log(`Retrieved ${annotations.length} total annotations`);
      return annotations;
    } catch (e) {
      new Notice('Failed to fetch Hypothes.is annotations. Please check your API token and try again.')
      console.error(e);
      throw e;
    }
  }

  private async doGetUpdatedUris(searchAfter: Date, limit = 1000) {

    try {
      let uris = new Set();

      // Paginate API calls via search_after param
      // search_after=null starts at with the earliest annotations
      while (uris.size < limit) {
        const response = await axios.get(
          `${this.baseUrl}/search`,
          {
            params: {
              limit: 200, // Max pagination size do not change
              sort: "updated",
              order: "asc", // Get all annotations since search_after
              search_after: searchAfter && searchAfter.toISOString(),
              user: this.userid,
            },
            headers: this.getHeaders()
          }
        );
        if (!response.data.rows.length) {
          break;
        }

        response.data.rows.map(r => uris.add(r['uri']));
        searchAfter = new Date(response.data.rows[response.data.rows.length - 1].updated);
      }

      return uris;
    } catch (e) {
      new Notice('Failed to fetch Hypothes.is annotations. Please check your API token and try again.')
      console.error(e);
      throw e;
    }
  }

  async getHighlightsWithUri(uri: string) {
    try {
      let annotations = [];
      let searchAfter = null;
      const limit = 200;
      // Paginate throw all annotations for this URI
      while (true) {
        const response = await axios.get(`${this.baseUrl}/search`, {
          params: {
            limit,
            uri,
            user: this.userid,
            sort: "updated",
            order: "asc",
            search_after: searchAfter,
          },
          headers: this.getHeaders()
        })

        const newAnnotations = response.data.rows;
        console.log(`Retrieved ${newAnnotations.length} annotations from ${uri}`);
        annotations = [ ...annotations, ...newAnnotations ];
        if (newAnnotations.length == 0 || newAnnotations.length < limit) {
          break;
        }
        searchAfter = newAnnotations[newAnnotations.length - 1].updated;
      }
      
      return annotations;
    } catch (e) {
      new Notice('Failed to fetch Hypothes.is annotations. Please check your API token and try again.')
      console.error(e);
      throw e;
    }
  }

  async getGroups() {
    try {
      const response = await axios.get(`${this.baseUrl}/groups`, { headers: this.getHeaders() })
      return response.data
    } catch (e) {
      new Notice('Failed to fetch Hypothes.is annotation groups. Please check your API token and try again.')
      console.error(e);
    }
  }
}
