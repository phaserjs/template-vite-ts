export {};
/**
 * The MRAID1 interface provides basic functionality for handling rich media ads in mobile environments.
 * It allows for control over the ad lifecycle and interactions, including event handling, state management, and UI control.
 */
interface MRAID1 {
  /**
   * Retrieves the current version of the MRAID specification that the implementation adheres to.
   * @returns The version of the MRAID specification.
   */
  getVersion(): MRAIDVersion;

  /**
   * Registers a handler for a specific event.
   * @param name The name of the event to listen for.
   * @param eventHandler The function to call when the event occurs.
   */
  addEventListener<K extends keyof MRAIDEventHandlers>(
    name: K,
    eventHandler: MRAIDEventHandlers[K]
  ): void;

  /**
   * Removes a handler for a specific event, or all handlers for that event if no specific handler is specified.
   * @param name The name of the event.
   * @param eventHandler The handler function to remove. If omitted, all handlers for the event are removed.
   */
  removeEventListener<K extends keyof MRAIDEventHandlers>(
    name: K,
    eventHandler?: MRAIDEventHandlers[K]
  ): void;

  /**
   * Retrieves the current state of the MRAID environment.
   * @returns The current state of the MRAID ad from the set of possible states.
   */
  getState(): MRAIDState;

  /**
   * Opens a URL in the native browser or app.
   * @param url The URL to open.
   */
  open(url: string): void;

  /**
   * Closes the currently open MRAID ad, if it is expanded or resized.
   */
  close(): void;

  /**
   * Expands the MRAID ad, optionally to a specified URL which loads into the expanded view.
   * @param url The URL to load in the expanded ad view, if any.
   */
  expand(url?: string): void;

  /**
   * Retrieves the current expand properties of the ad.
   * @returns The current settings for ad expansion.
   */
  getExpandProperties(): MRAIDExpandProperties;

  /**
   * Sets new properties for how the ad should behave when expanded.
   * @param newValues The new set of expand properties.
   */
  setExpandProperties(newValues: Partial<MRAIDExpandProperties>): void;

  /**
   * Retrieves the type of placement of the ad.
   * @returns The placement type, e.g., "inline" or "interstitial".
   */
  getPlacementType(): MRAIDPlacementType;

  /**
   * Initiates video playback within the ad.
   * @param url The URL of the video to play.
   */
  playVideo(url: string): void;

  /**
   * Enables or disables the custom close functionality in the ad UI.
   * @param newValue True if custom close is allowed, false otherwise.
   */
  useCustomClose(newValue: boolean): void;

  /**
   * Checks if the ad is currently viewable to the user.
   * @returns True if the ad is viewable, otherwise false.
   */
  isViewable(): boolean;
}

/**
 * The MRAID2 interface extends MRAID1 with additional functionalities,
 * supporting richer interaction capabilities and environmental awareness in rich media ads.
 */
interface MRAID2 extends MRAID1 {
  /**
   * Determines if a specific MRAID feature is supported by the current environment.
   * @param feature The feature to check for support.
   * @returns True if the feature is supported, otherwise false.
   */
  supports(feature: MRAIDFeature): boolean;

  /**
   * Triggers the ad to resize to a previously specified size set by setResizeProperties.
   */
  resize(): void;

  /**
   * Prompts the user to save an image to their device.
   * @param url The URL of the image to be saved.
   */
  storePicture(url: string): void;

  /**
   * Creates a calendar event on the user's device.
   * @param parameters The detailed information about the calendar event to create.
   */
  createCalendarEvent(parameters: MRAIDCalendarEvent): void;

  /**
   * Retrieves the current orientation properties of the ad container.
   * @returns The current orientation properties which dictate how orientation changes are handled.
   */
  getOrientationProperties(): MRAIDOrientationProperties;

  /**
   * Sets new orientation properties for the ad.
   * @param newValues The orientation properties to set, allowing partial updates.
   */
  setOrientationProperties(
    newValues: Partial<MRAIDOrientationProperties>
  ): void;

  /**
   * Gets the current position of the ad relative to the viewport.
   * @returns The current rectangle defining the ad's position and size.
   */
  getCurrentPosition(): MRAIDRect;

  /**
   * Gets the default position of the ad, typically the position it was initially loaded at.
   * @returns The default rectangle defining the ad's original position and size.
   */
  getDefaultPosition(): MRAIDRect;

  /**
   * Retrieves the maximum size the ad can expand to within the current context.
   * @returns The maximum available size for the ad based on the device screen or viewport.
   */
  getMaxSize(): MRAIDSize;

  /**
   * Retrieves the size of the screen of the device on which the ad is being displayed.
   * @returns The screen size dimensions.
   */
  getScreenSize(): MRAIDSize;

  /**
   * Retrieves the current properties used for resizing the ad.
   * @returns The current resize properties defining how the ad should behave when resized.
   */
  getResizeProperties(): MRAIDExpandProperties;

  /**
   * Sets the properties that dictate how the ad should behave when it is resized.
   * @param newValues The resize properties to set, allowing partial updates.
   */
  setResizeProperties(newValues: Partial<MRAIDExpandProperties>): void;
}

/**
 * Extends the MRAID2 interface with video-related functionalities specific to VPAID (Video Player-Ad Interface Definition).
 */
interface MRAID2VideoAddendum extends MRAID2 {
  /**
   * Initializes VPAID ad functionality with a specified VPAID object.
   * This method prepares the environment to handle VPAID ads, providing richer interaction and tracking capabilities.
   * @param vpaidObject The VPAID object that conforms to the MRAIDVPAIDObject structure, providing methods to manage and track video ads.
   */
  initVpaid(vpaidObject: MRAIDVPAIDObject): void;
}

/**
 * Extends MRAID2 by adding functionalities related to app orientation and geographical location, enhancing the adaptability and context awareness of the ad.
 */
interface MRAID3 extends MRAID2 {
  /**
   * Unloads the MRAID ad. This function should be used to clean up resources when the ad is no longer needed, ensuring that it does not consume system resources.
   */
  unload(): void;

  /**
   * Retrieves the current orientation of the app, including whether the orientation is locked.
   * This information can be used to adapt the ad display based on the current user experience and orientation settings.
   * @returns The current orientation state of the app.
   */
  getCurrentAppOrientation(): MRAIDAppOrientationState;

  /**
   * Attempts to retrieve the geographical location of the device if available.
   * This method provides the ability to serve location-based advertisements and content.
   * @returns The current location state if available, otherwise undefined if location services are disabled or unavailable.
   */
  getLocation(): MRAIDLocationState | undefined;
}

/**
 * Represents all possible MRAID versions and functionalities as a union type.
 * This type is used to define a general MRAID interface that can handle any MRAID version-specific object,
 * allowing flexibility across different implementations and versions.
 */
type MRAID = MRAID1 | MRAID2 | MRAID2VideoAddendum | MRAID3;

/**
 * Represents the versions of the MRAID API specification supported.
 * MRAIDVersion is used throughout the MRAID interfaces to specify and check the API version compatibility.
 */
type MRAIDVersion = "1.0" | "2.0" | "3.0";

/**
 * Provides a readonly declaration of the environment in which the MRAID ad is running.
 * This includes details about the MRAID SDK and the app environment, offering insights necessary for compliant ad operation.
 *
 * @property {MRAIDVersion} version - The MRAID version supported by the SDK.
 * @property {string} [sdk] - The name of the SDK implementing the MRAID API, optional.
 * @property {string} [sdkVersion] - The version of the SDK used, optional.
 * @property {string} [appId] - The application identifier in which the ad is displayed, optional.
 * @property {string} [ifa] - Identifier for advertisers, optional. Used for advertising and tracking purposes.
 * @property {boolean} [limitAdTracking] - Indicates whether ad tracking is limited based on user preferences, optional.
 * @property {boolean} [coppa] - Indicates whether the Children’s Online Privacy Protection Act (COPPA) settings are enabled, optional.
 */
export type MRAIDENVDeclaration = Readonly<{
  version: MRAIDVersion;
  sdk?: string;
  sdkVersion?: string;
  appId?: string;
  ifa?: string;
  limitAdTracking?: boolean;
  coppa?: boolean;
}>;

/**
 * Defines the set of event handlers for various MRAID events. These handlers are used to manage and respond to changes
 * in the ad environment, such as state changes, size adjustments, and user interactions.
 */
interface MRAIDEventHandlers {
  /**
   * Called when an error occurs within the MRAID environment.
   * @param message - A message describing the error.
   * @param action - The action during which the error occurred, represented by a key of the MRAID interface.
   */
  error: (message: string, action: keyof MRAID) => void;

  /**
   * Called when the MRAID environment is fully set up and ready to execute.
   */
  ready: () => void;

  /**
   * Called when the state of the MRAID ad changes (e.g., from hidden to visible, or closed).
   * @param state - The new state of the ad.
   */
  stateChange: (state: MRAIDState) => void;

  /**
   * Called when the size of the MRAID ad changes, typically due to a resize or expand operation.
   * @param width - The new width of the ad.
   * @param height - The new height of the ad.
   */
  sizeChange: (width: number, height: number) => void;

  /**
   * Called when the viewability of the ad changes, indicating whether it is visible on the screen.
   * @param isViewable - True if the ad is now viewable, false otherwise.
   */
  viewableChange: (isViewable: boolean) => void;

  /**
   * Called when the visible exposure of the ad changes, providing details about the extent of exposure.
   * @param exposedPercentage - The percentage of the ad that is visibly exposed.
   * @param visibleRectangle - The rectangle that defines the visible area of the ad.
   * @param occlusionRectangles - An array of rectangles defining areas that occlude the ad, or null if none.
   */
  exposureChange: (
    exposedPercentage: number,
    visibleRectangle: MRAIDRect,
    occlusionRectangles: MRAIDRect[] | null
  ) => void;

  /**
   * Called when the audio volume related to the ad changes, such as when a video ad's volume is adjusted.
   * @param newPercentage - The new volume level as a percentage of the maximum volume.
   */
  audioVolumeChange: (newPercentage: number) => void;

  /**
   * Called in response to a specific action taken within the ad, such as clicking or closing.
   * @param action - The action taken, represented by a key of the MRAID interface.
   */
  adAction: (action: keyof MRAID) => void;
}

/**
 * Enumerates the features that can be supported by an MRAID environment.
 * This allows the ad to query and interact with specific device capabilities.
 */
type MRAIDFeature =
  | "sms" // Indicates support for sending SMS messages.
  | "tel" // Indicates support for initiating telephone calls.
  | "calendar" // Indicates support for adding events to the device's calendar.
  | "storePicture" // Indicates support for storing pictures to the device's gallery.
  | "inlineVideo" // Indicates support for playing video directly within the ad view.
  | "vpaid" // Indicates support for VPAID (Video Player Ad-Serving Interface Definition).
  | "location"; // Indicates support for accessing the device's geographic location.

/**
 * Describes the placement types of an MRAID ad, determining how the ad is displayed within the host application.
 */
type MRAIDPlacementType =
  | "inline" // An ad that is displayed within the content of the application (e.g., within a newsfeed or between paragraphs).
  | "interstitial"; // A full-screen ad that appears at natural transition points in the application, such as between levels in a game.

/**
 * Defines the possible states of an MRAID ad. Each state represents a different phase
 * of the ad's lifecycle within the hosting application.
 */
type MRAIDState =
  | "loading" // The ad is loading. No interaction is possible and the ad is not yet visible.
  | "default" // The ad is visible and in its default state, as initially loaded.
  | "expanded" // The ad has been expanded beyond its default size, usually to cover the interface.
  | "resized" // The ad has changed size but not to the extent of an expansion.
  | "hidden"; // The ad is not visible to the user, though it may still be active in the background.

/**
 * Describes the orientation of an MRAID ad or the device environment. This allows ads to
 * adapt their layout and functionality to the current viewing mode.
 */
type MRAIDOrientation =
  | "portrait" // The device or ad is in a vertical orientation.
  | "landscape"; // The device or ad is in a horizontal orientation.

/**
 * Configures the orientation behavior of an MRAID ad, determining how it responds to changes
 * in device orientation or enforced orientation settings.
 */
interface MRAIDOrientationProperties {
  /**
   * Specifies whether the ad should allow orientation changes based on the device's physical orientation changes.
   * If false, the ad will maintain its orientation regardless of device movement.
   */
  allowOrientationChange: boolean;

  /**
   * Forces the ad to a specific orientation, regardless of the natural orientation of the device.
   * - "portrait": Forces the ad to display in portrait mode.
   * - "landscape": Forces the ad to display in landscape mode.
   * - "none": No forced orientation; the ad follows the device's current orientation.
   */
  forceOrientation: MRAIDOrientation | "none";
}

/**
 * Represents the current orientation state of the application containing the MRAID ad.
 * This state includes both the physical orientation of the device and whether the orientation is locked.
 */
interface MRAIDAppOrientationState {
  /**
   * The current orientation of the application.
   * - "portrait": The application is oriented in a vertical layout.
   * - "landscape": The application is oriented in a horizontal layout.
   */
  orientation: MRAIDOrientation;

  /**
   * Indicates whether the application's orientation is locked, preventing it from changing in response to device rotations.
   */
  locked: boolean;
}

/**
 * Defines a coordinate position used within MRAID to specify locations on the screen.
 * This is commonly used for positioning ads or elements within ads.
 */
interface MRAIDPosition {
  /**
   * The x-coordinate of the position, typically representing horizontal positioning from the left edge of the screen or container.
   */
  x: number;

  /**
   * The y-coordinate of the position, typically representing vertical positioning from the top edge of the screen or container.
   */
  y: number;
}

/**
 * Represents the size dimensions of an element within the MRAID environment, typically used for specifying ad sizes.
 */
interface MRAIDSize {
  /**
   * The width of the element in pixels.
   */
  width: number;

  /**
   * The height of the element in pixels.
   */
  height: number;
}

/**
 * Represents a rectangle in the MRAID environment, combining position and size to define the shape and location of an element.
 * This is commonly used to specify the area occupied by an ad or a component within an ad.
 */
type MRAIDRect = MRAIDPosition & MRAIDSize;

/**
 * Describes the properties that define the behavior and appearance of an expanded MRAID ad.
 * These properties are used to control how an ad expands beyond its initial size and how it interacts with user input.
 */
type MRAIDExpandProperties = MRAIDSize & {
  /**
   * Specifies whether a custom close button should be used when the ad is expanded.
   * If true, the ad must implement its own button to close the expanded view. If false, a default close button is provided by the MRAID environment.
   */
  useCustomClose: boolean;

  /**
   * Indicates whether the expanded ad will behave modally. A modal ad captures all user input, preventing interaction with underlying content.
   * This property is readonly and typically set by the MRAID environment to ensure consistent ad behavior.
   */
  readonly isModal: boolean;
};

/**
 * Describes the properties used to control the resizing behavior of an MRAID ad.
 * This includes dimensions and constraints on how the ad can be resized within the host application.
 */
export type MRAIDResizeProperties = MRAIDSize & {
  /**
   * The width to which the ad should resize, in pixels. This property reiterates MRAIDSize width for clarity.
   */
  width: number;

  /**
   * The height to which the ad should resize, in pixels. This property reiterates MRAIDSize height for clarity.
   */
  height: number;

  /**
   * Indicates whether the ad can be resized off the screen boundaries. If true, parts of the ad can be outside the visible viewport.
   */
  allowOffscreen: boolean;

  /**
   * Specifies the position of the custom close button on the resized ad. This option allows for customization of the close button's location to ensure it is accessible.
   * - "top-left": Position the close button at the top-left corner of the ad.
   * - "top-right": Position the close button at the top-right corner of the ad.
   * - "bottom-right": Position the close button at the bottom-right corner of the ad.
   * - "bottom-left": Position the close button at the bottom-left corner of the ad.
   */
  customClosePosition?:
    | "top-left"
    | "top-right"
    | "bottom-right"
    | "bottom-left";
};

/**
 * Enumerates the different types of location data sources that can be utilized within the MRAID environment.
 * These values help define the reliability and origin of the location data provided to the ad.
 */
declare const enum MRAIDLocationType {
  /**
   * Location determined through GPS or other device location services. This is typically the most accurate source.
   */
  LocationServices = 1,

  /**
   * Location determined through IP address analysis. Generally less accurate than location services and more approximate.
   */
  IPGeoLocation = 2,

  /**
   * Location data provided by the user, such as entering a postal code or city name. Accuracy can vary widely based on the user input.
   */
  UserProvided = 3,
}

/**
 * Represents the geographical location state of the device running the MRAID ad. This interface provides detailed
 * location data that can be used to tailor ad content based on geographical targeting or to enrich user interactions.
 */
interface MRAIDLocationState {
  /**
   * The latitude coordinate of the device's current location.
   */
  lat: number;

  /**
   * The longitude coordinate of the device's current location.
   */
  lon: number;

  /**
   * The type of location data provided, which helps determine the source and reliability of the data.
   */
  type: MRAIDLocationType;

  /**
   * The accuracy of the location data, measured in meters. If undefined, the accuracy is unknown.
   */
  accuracy: number | undefined;

  /**
   * The timestamp of the last location fix, represented as the number of milliseconds since the Unix epoch.
   * This provides context for the age of the location data.
   */
  lastfix: number;

  /**
   * The identifier of the IP service provider, if location data is derived from IP geolocation. If undefined,
   * the IP service is not applicable or not known.
   */
  ipservice: string | undefined;
}

/**
 * Defines the structure for calendar events that can be created through the MRAID API.
 * This type is used to provide all necessary details to add an event to the user's device calendar.
 */
type MRAIDCalendarEvent = {
  /**
   * An optional identifier for the event. This can be used to reference or manage the event within the ad system.
   */
  id?: string;

  /**
   * A detailed description of the event. This should provide users with sufficient information about the event's nature.
   */
  description: string;

  /**
   * An optional location where the event will take place. This could be a physical address or a virtual meeting URL.
   */
  location?: string;

  /**
   * An optional brief summary of the event, which could be used as the title in the user's calendar.
   */
  summary?: string;

  /**
   * The start time of the event, formatted as an ISO 8601 string.
   */
  start: string;

  /**
   * The optional end time of the event, also formatted as an ISO 8601 string.
   */
  end?: string;

  /**
   * An optional status for the event, such as "confirmed" or "tentative".
   */
  status?: string;

  /**
   * An optional property that indicates the transparency of the event (i.e., if the time is marked as busy or free).
   */
  transparency?: string;

  /**
   * An optional definition for how the event recurs, such as daily, weekly, or yearly. This field might require a specific format or object.
   */
  recurrence?: any;

  /**
   * An optional reminder setting for the event, specifying when a reminder notification should be sent to the user.
   */
  reminder?: string;
};

/**
 * Represents a VPAID (Video Player Ad-Serving Interface Definition) ad object within the MRAID framework.
 * This object provides methods for controlling the playback of a VPAID ad, querying ad state, and managing event listeners.
 */
type MRAIDVPAIDObject = {
  [key: string]: any; // Allows for additional properties not strictly defined by the interface.

  /**
   * Subscribes to a specific event from the VPAID ad.
   * @param fn The handler function that will be invoked when the event is fired.
   * @param event The name of the event to subscribe to.
   * @param listenerScope An optional scope object for the event handler; this affects the value of 'this' within the handler.
   */
  subscribe<K extends keyof MRAIDVPAIDEventHandlers>(
    fn: MRAIDVPAIDEventHandlers[K],
    event: string,
    listenerScope?: any
  ): void;

  /**
   * Unsubscribes from a specific event, removing the registered event handler.
   * @param fn The handler function that was originally subscribed.
   * @param event The name of the event to unsubscribe from.
   */
  unsubscribe<K extends keyof MRAIDVPAIDEventHandlers>(
    fn: MRAIDVPAIDEventHandlers[K],
    event: string
  ): void;

  /**
   * Starts the VPAID ad playback.
   */
  startAd(): void;

  /**
   * Retrieves the total duration of the VPAID ad in seconds.
   * @returns The total ad duration as a number.
   */
  getAdDuration(): number;

  /**
   * Retrieves the remaining time in seconds until the VPAID ad finishes playing.
   * @returns The remaining ad time as a number.
   */
  getAdRemainingTime(): number;
};

/**
 * Defines the set of event handlers specific to VPAID (Video Player Ad-Serving Interface Definition) ad interactions.
 * Each handler corresponds to a different event in the lifecycle of a VPAID ad, allowing for detailed tracking and interaction.
 */
interface MRAIDVPAIDEventHandlers {
  /**
   * Called when there is a click-through event on the ad.
   * @param url The URL to which the ad should link.
   * @param id An identifier for the click-through event.
   * @param playerHandles A boolean indicating whether the video player or the ad itself handles the click-through action.
   */
  AdClickThru: (url: string, id: string, playerHandles: boolean) => void;

  /**
   * Called when an error occurs during ad processing.
   * @param message A message describing the error encountered.
   */
  AdError: (message: string) => void;

  /**
   * Called when the ad is first displayed to the user, marking an impression.
   */
  AdImpression: () => void;

  /**
   * Called when the ad playback is paused.
   */
  AdPaused: () => void;

  /**
   * Called when the ad playback resumes from a paused state.
   */
  AdPlaying: () => void;

  /**
   * Called at the start of the video ad playback.
   */
  AdVideoStart: () => void;

  /**
   * Called when the video ad reaches the first quartile of its playback.
   */
  AdVideoFirstQuartile: () => void;

  /**
   * Called when the video ad reaches the midpoint of its playback.
   */
  AdVideoMidpoint: () => void;

  /**
   * Called when the video ad reaches the third quartile of its playback.
   */
  AdVideoThirdQuartile: () => void;

  /**
   * Called when the video ad completes its playback.
   */
  AdVideoComplete: () => void;
}

/**
 * Global variable representing the MRAID (Mobile Rich Media Ad Interface Definitions) object,
 * providing access to various functionalities for interacting with mobile ads.
 */
declare global {
  var mraid: MRAID2;
}
