class Route < ActiveRecord::Base

  attr_accessor :forwarder, :email, :forward_count
  attr_accessible :enabled

  before_validation :generate_forwarder
  validates_uniqueness_of :forwarder

  belongs_to :user

  protected

  def generate_forwarder
    return if self.forwarder

    adjectives = 'flying running big red blue black green purple shiny light falling active'.split
    nouns = 'rock boat bear monster bug rabbit hamster haze mouse button rocket bottle graph token code'.split
    self.forwarder = loop do
      a = "#{adjectives.sample}-#{nouns.sample}-#{SecureRandom.random_number(1000000)+1}"
      break a unless Route.where(:forwarder => a).exists?
    end
  end

end